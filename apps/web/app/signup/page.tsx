import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
              <img src="/logo.svg" alt="Helixque" className="size-4" />
            </div>
            Helixque
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/auth-bg-capybara.png"
          alt="Helixque Capybaras Meeting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-bold mb-2">Peer to Peer Meet</h2>
          <p className="text-lg opacity-90">
            Unlock your potential by connecting with top-tier professionals and
            mentors.
          </p>
        </div>
      </div>
    </div>
  );
}
