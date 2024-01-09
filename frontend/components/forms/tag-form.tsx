"use client";

import { Input } from "@/components/ui/input";
import { tagSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon, Wand2Icon } from "lucide-react";
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
import { addTag, editTag } from "@/app/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  type: "add" | "edit";
  tag?: z.infer<typeof tagSchema> & {
    id: number;
  };
  isAddOnContact?: boolean;
};

export function TagForm({ type, tag, isAddOnContact }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag ?? {
      name: "",
    },
  });

  async function onSubmit(
    formData: z.infer<typeof tagSchema>,
    event: React.FormEvent<HTMLFormElement>
  ) {
    try {
      event.preventDefault();
      event.stopPropagation();

      setIsPending(true);

      if (type === "add") {
        await addTag(formData);

        toast.success("Tag added successfully.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        setOpen(false);
      }

      if (type === "edit") {
        const formDataWithId = {
          ...formData,
          id: tag!.id,
        };

        await editTag(formDataWithId);

        toast.success("Tag edited successfully.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        setOpen(false);
      }
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
      {type === "add" ? (
        <>
          {isAddOnContact ? (
            <DialogTrigger asChild>
              <Button className="flex items-center justify-start w-full gap-2 font-normal rounded-lg cursor-pointer">
                <Wand2Icon className="w-4 h-4" /> Add tag
              </Button>
            </DialogTrigger>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                    >
                      <PlusIcon className="w-5 h-5 text-foreground" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Tag</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 rounded-full"
                >
                  <EditIcon className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
        }}
      >
        <DialogHeader>
          {type === "add" ? (
            <>
              <DialogTitle className="text-2xl">Add Tag</DialogTitle>
              <DialogDescription>
                Add a new tag for your contacts to use. Tags are used to
                categorize your contacts.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-2xl">Edit Tag</DialogTitle>
              <DialogDescription>
                Edit a tag for your contacts to use. Tags are used to categorize
                your contacts.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(event) =>
              onSubmit(form.getValues() as z.infer<typeof tagSchema>, event)
            }
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              {type === "add" ? (
                <Button
                  type="submit"
                  disabled={isPending || !form.getValues("name")}
                >
                  {isPending && (
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Add Tag
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                >
                  {isPending && (
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Edit Tag
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
