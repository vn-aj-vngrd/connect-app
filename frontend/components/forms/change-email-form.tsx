"use client";

import { Input } from "@/components/ui/input";
import { newEmailSchema } from "@/schemas";
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
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { changeEmail } from "@/app/actions";

export function ChangeEmailForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof newEmailSchema>>({
    resolver: zodResolver(newEmailSchema),
  });

  async function onSubmit(formData: z.infer<typeof newEmailSchema>) {
    try {
      setIsPending(true);

      const message = await changeEmail(formData);

      if (message) {
        form.setError("newEmail", {
          message,
        });

        return;
      }

      toast.success(
        "An email has been sent to your new email address. Please check your inbox and confirm.",
        {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        }
      );

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
          <DialogTitle className="text-2xl">Change Email</DialogTitle>
          <DialogDescription>
            Update your email address. We&apos;ll send a confirmation email to
            your new email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="New Email Address"
                            type="text"
                            autoComplete="off"
                            {...field}
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <Button
                type="submit"
                disabled={
                  isPending ||
                  form.getValues("newEmail") === undefined ||
                  form.getValues("newEmail") === ""
                }
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
