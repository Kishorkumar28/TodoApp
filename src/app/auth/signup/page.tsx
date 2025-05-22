import Link from "next/link";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px] p-8 rounded-lg shadow-xl bg-card">
        <div className="flex flex-col space-y-2 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Join the Guild!
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your QuestLog account to start your adventures.
          </p>
        </div>
        <UserAuthForm isSignUp={true} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="hover:text-brand underline underline-offset-4 text-accent"
          >
            Sign In
          </Link>
        </p>
         <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-brand underline underline-offset-4"
          >
            Return to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
