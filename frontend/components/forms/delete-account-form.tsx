"use client";

import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/schemas";
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
import { deleteAccount } from "@/app/actions";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function DeleteAccountForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<"password" | "text">("password");

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  async function onSubmit(formData: z.infer<typeof passwordSchema>) {
    try {
      setIsPending(true);

      const message = await deleteAccount(formData);

      if (message) {
        form.setError("password", {
          message,
        });

        return;
      }

      toast.success("Account deleted successfully.", {
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
        <Button
          variant="outline"
          className="text-red-500 hover:text-white hover:bg-red-500"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action is
            irreversible. You will lose all your data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <FormItem>
                      <FormLabel>
                        To confirm, please type your password.
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Password"
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

              <Button
                type="submit"
                disabled={isPending || !form.getValues("password")}
                variant="outline"
                className="text-red-500 hover:text-white hover:bg-red-500"
              >
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
