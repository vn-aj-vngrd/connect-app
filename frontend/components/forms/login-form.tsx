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

import { loginSchema } from "@/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth/login";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: FormProps) {
  const router = useRouter();

  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<"password" | "text">("password");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/all");
    },
    onError: (error: AxiosError<Response<Error>>) => {
      setMessage("");

      const err = error.response?.data.message ?? "Something went wrong.";

      if (err === "Email not confirmed") {
        return router.push(
          "/email-sent?title=Email not confirmed&description=Please check your email to confirm your account."
        );
      }

      setMessage(err);
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {message && (
        <div className="px-8 py-4 text-sm text-center text-red-500 bg-red-100 rounded-md">
          <p>{message}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
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
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>

                    <FormMessage className="pb-2" />
                  </FormItem>
                </div>
              )}
            />

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

            <Button disabled={mutation.isPending}>
              {mutation.isPending && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Log in
            </Button>
          </div>
        </form>
      </Form>

      <Link
        href="/forgot-password"
        className="flex items-center justify-center w-full text-sm"
      >
        <Button variant="secondary" className="w-full">
          Forgot password?
        </Button>
      </Link>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>

      <div className="flex justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="ml-1 font-semibold hover:underline hover:underline-offset-4 text-foreground"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
