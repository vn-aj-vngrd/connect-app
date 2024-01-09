"use client";

import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  filename: z.string(),
});

type Props = {
  ids?: number[];
  onClose?: () => void;
  isText?: boolean;
};

export function ExportContactsForm({ ids, onClose, isText = false }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/export`;

      let _ids: string[] = [];

      ids?.forEach((id) => {
        _ids.push(`ids=${id}`);
      });

      apiUrl += `?${_ids.join("&")}`;

      const res = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("No contacts found.", {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });

          return;
        }

        toast.error("Something went wrong.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      const data = await res.blob();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = formData.filename + ".json";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      toast.success("Contacts exported successfully.", {
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
      {isText ? (
        <DialogTrigger asChild>
          <span className="w-full p-2 text-sm rounded cursor-pointer hover:bg-secondary">
            Export
          </span>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">Export</Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Export Contacts</DialogTitle>
          <DialogDescription>
            Download a copy of your contacts. This file can be use to import
            your contacts to same or another account.{" "}
            <>
              {ids && ids?.length > 0
                ? `You currently selected ${ids.length} contact${
                    ids.length > 1 ? "s" : ""
                  }.`
                : ""}
            </>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="filename"
                render={({ field }) => (
                  <div className="grid gap-1">
                    <FormItem>
                      <FormLabel>
                        To confirm, please enter a name for the exported file.
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Name"
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
                  form.getValues("filename") === undefined ||
                  form.getValues("filename") === ""
                }
              >
                {isPending && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                Export
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
