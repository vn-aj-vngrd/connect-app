"use client";

import { Banner } from "@/components/common/banner";
import { SignupForm } from "../../../../components/forms/signup-form";
import { Title } from "@/components/layout/title";

const title = "Create an account";
const description = "Enter the required details to continue";
export default function SignupPage() {
  return (
    <div className="flex flex-row justify-between w-full h-full">
      <Banner />

      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full space-y-10">
          <Title title={title} description={description} />

          <SignupForm className="w-full px-5 sm:px-0 sm:w-[500px]" />
        </div>
      </div>
    </div>
  );
}
