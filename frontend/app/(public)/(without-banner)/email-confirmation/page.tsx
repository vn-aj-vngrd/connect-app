"use client";

import { Title } from "@/components/layout/title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title") ?? "Email Confirmation Failed";
  const description =
    searchParams.get("description") ??
    "Something went wrong. Please try again.";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full space-y-10">
        <Title title={title} description={description} />

        {title === "Email Changed" ? (
          <Link href="/" className="w-full max-w-sm text-center">
            <Button className="w-full text-center">Take me home</Button>
          </Link>
        ) : (
          <Link href="/login" className="w-full max-w-sm text-center">
            <Button className="w-full text-center">Proceed to Login </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
