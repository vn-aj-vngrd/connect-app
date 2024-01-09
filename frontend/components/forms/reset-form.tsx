"use client";

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

import { resetPasswordSchema } from "@/schemas";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/auth/resetPassword";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string;
  code: string;
}

export function ResetForm({ className, userId, code, ...props }: FormProps) {
  const router = useRouter();

  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [type, setType] = useState<"password" | "text">("password");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push(
        "/reset-password?title=Password Reset&description=Your password has been reset."
      );
    },
    onError: (error: AxiosError<Response<Error>>) => {
      setErrors([]);
      setMessage("");

      const err = error.response?.data.message ?? "Something went wrong.";

      if (err === "Password reset failed") {
        setErrors(error.response?.data.errors ?? []);
      } else {
        setMessage(err);
      }
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof resetPasswordSchema>) {
    try {
      await mutation.mutateAsync({
        userId,
        password: formData.password,
        code,
      });
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
              name="password"
              render={({ field }) => (
                <div className="grid gap-1">
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="New Password"
                          type={type}
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

            <Button disabled={mutation.isPending}>
              {mutation.isPending && (
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
