"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { userSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUser } from "@/app/actions";
import { AnimatePresence, motion } from "framer-motion";
import { ImageUploader } from "../utils/image-uploader";
import { ChangeEmailForm } from "./change-email-form";

type Props = {
  user: z.infer<typeof userSchema>;
};

export function ProfileForm({ user }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  async function onSubmit(formData: z.infer<typeof userSchema>) {
    try {
      if (!form.formState.isDirty) return;

      setIsPending(true);

      await updateUser(formData);

      toast.success("Profile updated successfully.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      setIsChanged(false);
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

  function onImageUpload(base64: string) {
    form.setValue("image", base64, {
      shouldDirty: true,
    });
  }

  function onImageRemove() {
    form.setValue("image", null, {
      shouldDirty: true,
    });
  }

  useEffect(() => {
    setIsChanged(form.formState.isDirty);
  }, [form.formState.isDirty]);

  useEffect(() => {
    form.reset(user);
  }, [form, user]);

  return (
    <div className="relative h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5">
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <ImageUploader
                defaultValue={
                  user.image ? `data:image/png;base64,${user.image}` : undefined
                }
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
              />
              <FormDescription>
                Your profile image is used to identify you.
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="User Name" type="text" {...field} />
                  </FormControl>

                  <FormDescription>
                    Your username is used to identify you and is unique. It is
                    used during login.
                  </FormDescription>
                  <FormMessage className="pb-2" />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2">
                  <Input value={user.email} placeholder="Email" type="text" />
                  <ChangeEmailForm />
                </div>
              </FormControl>

              <FormDescription>
                Your email is used to identify you. It is used to verify your
                account and for password resets.
              </FormDescription>
              <FormMessage className="pb-2" />
            </FormItem>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your first name is used to address you.
                  </FormDescription>

                  <FormMessage className="pb-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your last name is used to address you.
                  </FormDescription>

                  <FormMessage className="pb-2" />
                </FormItem>
              )}
            />

            <AnimatePresence
              mode="wait"
              onExitComplete={() => setIsChanged(false)}
            >
              {isChanged && (
                <motion.div
                  className="sticky w-full transform bottom-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="w-full">
                    <div className="flex flex-row items-center justify-center gap-5 px-4 py-2 border rounded-lg bg-background">
                      <p>Careful - You have unchanged changes!</p>

                      <div className="flex flex-col gap-2 lg:flex-row">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => form.reset()}
                        >
                          Reset
                        </Button>
                        <Button type="submit" disabled={isPending}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Form>
    </div>
  );
}
