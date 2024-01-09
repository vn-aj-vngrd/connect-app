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

import { forgotPasswordSchema } from "@/schemas";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth/forgotPassword";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotForm({ className, ...props }: FormProps) {
  const router = useRouter();

  const [message, setMessage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      router.push(
        "/email-sent?title=Email sent&description=Please check your email to reset your password."
      );
    },
    onError: (error: AxiosError<Response<Error>>) => {
      const err = error.response?.data.message ?? "Something went wrong.";

      setMessage(err);
    },
  });

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof forgotPasswordSchema>) {
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
              name="email"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        {...field}
                        disabled={mutation.isPending}
                      />
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
              Continue
            </Button>
          </div>
        </form>
      </Form>

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
