import Link from "next/link";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px] p-8 rounded-lg shadow-xl bg-card">
        <div className="flex flex-col space-y-2 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back, Adventurer!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue your quests.
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          New to QuestLog?{" "}
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4 text-accent"
          >
            Forge an Account
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
