"use client";

import { Banner } from "@/components/common/banner";
import { ResetForm } from "../../../../components/forms/reset-form";
import { Title } from "@/components/layout/title";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResetPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title") ?? "Reset Password Expired";
  const description =
    searchParams.get("description") ??
    "Your reset password link has expired. Please try again.";

  const userId = searchParams.get("userId") ?? "";
  const code = searchParams.get("code") ?? "";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full space-y-10">
        <Title title={title} description={description} />

        {title == "Reset Password" && (
          <ResetForm
            className="w-full px-5 sm:px-0 sm:w-[350px]"
            userId={userId}
            code={code}
          />
        )}

        {title === "Password Reset" && (
          <Link href="/login" className="w-full max-w-sm text-center">
            <Button className="w-full text-center">Proceed to Login </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
