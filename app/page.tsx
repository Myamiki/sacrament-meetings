import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-shell">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">My Ward <span>/</span> Sunday desk</p>
          <h1 id="home-heading">
            Make room for what matters.
          </h1>
          <p className="hero-intro">
            A simple, thoughtful place to prepare this week&apos;s sacrament meeting and keep the record of Sundays past.
          </p>
          <div className="hero-actions">
            <Link href="/meetings/current" className="button-primary">Open this Sunday <span aria-hidden="true">-&gt;</span></Link>
            <Link href="/meetings" className="text-link">Browse the archive</Link>
          </div>
        </div>

        <div className="date-stamp" aria-label="Today">
          <span className="date-stamp-label">Today</span>
          <strong>18</strong>
          <span>September 2026</span>
        </div>
      </section>

      <section className="home-lower" aria-label="Meeting program overview">
        <div className="welcome-note">
          <p className="eyebrow">A little order for the week</p>
          <p className="note-heading">The best programs feel calm before anyone takes a seat.</p>
          <p className="note-body">Keep the details together so the people, prayers, music, and message can take their proper place.</p>
          <div className="note-signoff">
            <span className="signoff-line" />
            <span>Meeting desk</span>
          </div>
        </div>

        <article className="program-preview" aria-label="Meeting program preview">
          <div className="program-topline">
            <span>Next on the stand</span>
            <Image src="/file.svg" alt="Printed program icon" width={22} height={22} priority />
          </div>
          <div className="program-date">Sunday <strong>03</strong> May 2026</div>
          <p className="program-title">Sacrament Meeting</p>
          <p className="program-subtitle">Regular meeting <span aria-hidden="true">/</span> My Ward</p>
          <div className="program-rule" />
          <dl className="program-list">
            <div><dt>Opening</dt><dd>The Spirit of God</dd></div>
            <div><dt>Message</dt><dd>Faith in Jesus Christ</dd></div>
            <div><dt>Closing</dt><dd>O God, Our Help in Ages Past</dd></div>
          </dl>
          <Link href="/meetings/1" className="program-link">View full program <span aria-hidden="true">-&gt;</span></Link>
        </article>
      </section>
    </div>
  );
}
