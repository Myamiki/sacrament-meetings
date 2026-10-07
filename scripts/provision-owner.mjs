// One-time local setup: node --env-file=.env.local scripts/provision-owner.mjs
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';

function promptEmail() {
  const readline = createInterface({ input: stdin, output: stdout });
  return readline.question('Owner email: ').finally(() => readline.close());
}

function promptPassword() {
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
    throw new Error('A terminal is required to enter the password securely.');
  }

  stdout.write('Owner password (input hidden): ');
  stdin.setEncoding('utf8');
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let password = '';

    function cleanup() {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === '\u0003' || character === '\u0004') {
          cleanup();
          reject(new Error('Password entry was cancelled.'));
          return;
        }

        if (character === '\r' || character === '\n') {
          cleanup();
          resolve(password);
          return;
        }

        if (character === '\u007f' || character === '\b') {
          password = Array.from(password).slice(0, -1).join('');
        } else if (character >= ' ') {
          password += character;
        }
      }
    }

    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const email = (await promptEmail()).trim().toLowerCase();
  if (!email) {
    throw new Error('Email is required.');
  }

  const sql = neon(process.env.DATABASE_URL);
  const existingUsers = await sql`
    SELECT id
    FROM users
    WHERE lower(email) = ${email}
    LIMIT 1
  `;

  if (existingUsers.length > 0) {
    console.log('An account with that email already exists.');
    return;
  }

  let password = await promptPassword();
  if (!password) {
    password = '';
    throw new Error('Password is required.');
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const insertedUsers = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      ON CONFLICT (lower(email)) DO NOTHING
      RETURNING id
    `;

    if (insertedUsers.length === 0) {
      console.log('An account with that email already exists.');
      return;
    }

    console.log('Owner account created successfully.');
  } finally {
    password = '';
  }
}

main().catch(() => {
  console.error('Owner account setup failed. Check the local database configuration and try again.');
  process.exitCode = 1;
});
