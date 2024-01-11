"use client";

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
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ImportIcon } from "lucide-react";
import { FileUploader } from "../utils/file-uploader";
import { revalidate } from "@/app/actions";

const formSchema = z.object({
  file: z.any(),
});

export function ImportContactsForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/import`;

      const formData = new FormData();
      formData.append("file", data.file);

      const res = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
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
        }

        if (res.status === 400) {
          toast.error("Invalid file.", {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
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

      revalidate({
        contacts: true,
        tags: true,
      });

      toast.success("Contacts imported successfully.", {
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

  const onFileUpload = (file: File) => {
    form.setValue("file", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center gap-3 min-w-fit"
          variant="outline"
        >
          <ImportIcon className="w-5 h-5 text-foreground" />
          Import
        </Button>
      </DialogTrigger>

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Import Contacts</DialogTitle>
          <DialogDescription>
            Import your contacts from a JSON file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FileUploader onFileUpload={onFileUpload} />

              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending && (
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                Import
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
