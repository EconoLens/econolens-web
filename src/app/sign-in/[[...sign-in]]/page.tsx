import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#F5F0E8]">
      <SignIn />
    </div>
  );
}
