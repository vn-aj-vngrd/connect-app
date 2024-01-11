"use client";

import { Input } from "@/components/ui/input";
import { changePasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Icons } from "../common/icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { changePassword } from "@/app/actions";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function ChangePasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<"password" | "text">("password");

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(formData: z.infer<typeof changePasswordSchema>) {
    try {
      setIsPending(true);

      const message = await changePassword(formData);

      if (message) {
        if (message === "Please enter a new password.") {
          form.setError("newPassword", {
            message,
          });
        }

        if (message === "Current password is incorrect.") {
          form.setError("currentPassword", {
            message,
          });
        }

        return;
      }

      toast.success("Password changed successfully.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      setOpen(false);
    } catch (error: unknown) {
      const err = error as Error;

      toast.error(err.message || "Something went wrong.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change</Button>
      </DialogTrigger>

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Change Password</DialogTitle>
          <DialogDescription>
            Update your password with a new one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Current Password"
                            type={type}
                            autoComplete="off"
                            {...field}
                            disabled={isPending}
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
                name="newPassword"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="New Password"
                            type={type}
                            autoComplete="off"
                            {...field}
                            disabled={isPending}
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm Password"
                            type={type}
                            autoComplete="off"
                            {...field}
                            disabled={isPending}
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

              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
