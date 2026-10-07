import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Sign In</h1>
      <LoginForm />
    </main>
  );
}
