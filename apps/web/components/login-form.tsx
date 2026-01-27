"use client";

import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
// Field imports removed

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center items-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
          <img
            src="https://www.helixque.com/logo.svg"
            alt="Helixque Logo"
            className="size-8"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Login securely with your LinkedIn account
        </p>
      </div>
      <div className="grid gap-4">
        <Button
          variant="default"
          className="w-full h-11"
          onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 mr-2"
          >
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.22-.44-1.65-1.63-1.65-1.18 0-1.74.89-1.74 2.13V19h-3v-9h3v1.2c.5-.8 1.25-1.38 3.03-1.38 3.5 0 3.34 3.24 3.34 5.88z" />
          </svg>
          Continue with LinkedIn
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
