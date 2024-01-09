"use client";

import { Banner } from "@/components/common/banner";
import { LoginForm } from "../../../../components/forms/login-form";
import { ZapIcon } from "lucide-react";
import { Title } from "@/components/layout/title";

const title = "Login to Connect";
const description = "Enter your email and password to continue";

export default function LoginPage() {
  return (
    <div className="flex flex-row justify-between w-full h-full">
      <Banner />

      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full space-y-10">
          <Title title={title} description={description} />

          <LoginForm className="w-full px-5 sm:px-0 sm:w-[350px]" />
        </div>
      </div>
    </div>
  );
}
