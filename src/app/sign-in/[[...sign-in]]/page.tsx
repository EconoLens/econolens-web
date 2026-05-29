export const dynamic = 'force-dynamic';
import Link from "next/link";

// Clerk SignIn temporarily replaced until NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in Vercel
export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Sign in</h1>
        <p className="mt-2 text-neutral-600">Authentication will be enabled once setup is complete.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-neutral-900 underline">Back to home</Link>
      </div>
    </main>
  );
}
