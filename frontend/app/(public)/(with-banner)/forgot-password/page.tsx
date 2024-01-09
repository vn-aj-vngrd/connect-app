"use client";

import { Banner } from "@/components/common/banner";
import { ForgotForm } from "./forgot-form";
import { Title } from "@/components/layout/title";

const title = "Forgot your password";
const description = "Enter your email to reset your password";

export default function ForgotPage() {
  return (
    <div className="flex flex-row justify-between w-full h-full">
      <Banner />

      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full space-y-10">
          <Title title={title} description={description} />

          <ForgotForm className="w-full px-5 sm:px-0 sm:w-[350px]" />
        </div>
      </div>
    </div>
  );
}
