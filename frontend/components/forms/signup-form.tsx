"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Error, Response } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { signupSchema } from "@/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/api/auth/signup";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignupForm({ className, ...props }: FormProps) {
  const router = useRouter();

  const [errors, setErrors] = useState<Error[]>([]);
  const [type, setType] = useState<"password" | "text">("password");

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.push(
        "/email-sent?title=Email Confirmation&description=Please check your email to confirm your account."
      );
    },
    onError: (error: AxiosError<Response<Error>>) => {
      setErrors([]);

      const err = error.response?.data.errors ?? [];

      setErrors(err);
    },
  });

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signupSchema>) {
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {errors.length > 0 && (
        <div className="px-8 py-4 text-sm text-center text-red-500 bg-red-100 rounded-md">
          {errors.map((error) => (
            <p key={error.code}>{error.description}</p>
          ))}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        type="text"
                        autoComplete="off"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        type="text"
                        autoComplete="off"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        type="text"
                        autoComplete="off"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="text"
                        autoComplete="off"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          type={type}
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoComplete="off"
                          {...field}
                          disabled={mutation.isPending}
                        />

                        {field.value && (
                          <>
                            {type === "password" ? (
                              <EyeOffIcon
                                onClick={() => setType("text")}
                                className="absolute w-4 h-4 text-gray-400 cursor-pointer right-3 top-3"
                              />
                            ) : (
                              <EyeIcon
                                onClick={() => setType("password")}
                                className="absolute w-4 h-4 text-gray-400 cursor-pointer right-3 top-3"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm Password"
                          type={type}
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoComplete="off"
                          {...field}
                          disabled={mutation.isPending}
                        />

                        {field.value && (
                          <>
                            {type === "password" ? (
                              <EyeOffIcon
                                onClick={() => setType("text")}
                                className="absolute w-4 h-4 text-gray-400 cursor-pointer right-3 top-3"
                              />
                            ) : (
                              <EyeIcon
                                onClick={() => setType("password")}
                                className="absolute w-4 h-4 text-gray-400 cursor-pointer right-3 top-3"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

            <Button
              type="submit"
              className="col-span-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
      <p className="px-8 text-sm text-center text-muted-foreground">
        By clicking continue, you agree to our <br />
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
      <div className="flex justify-center text-sm text-muted-foreground">
        Already have an account?
        <Link
          href="/login"
          className="ml-1 font-semibold hover:underline hover:underline-offset-4 text-foreground"
        >
          Login
        </Link>
      </div>{" "}
    </div>
  );
}
