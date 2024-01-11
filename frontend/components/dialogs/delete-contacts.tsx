"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteContacts } from "@/app/actions";
import { useState } from "react";
import { useContactStore } from "@/store/useContactStore";

type Props = {
  ids: number[];
  onClose?: () => void;
};

export function DeleteContacts({ ids, onClose }: Props) {
  const {
    setContacts,
    contacts: prevContacts,
    setStartingIndex,
    startingIndex,
  } = useContactStore((state) => state);

  const [open, setOpen] = useState<boolean>(false);

  async function handleDelete() {
    try {
      await deleteContacts(ids);

      const updatedContacts = prevContacts.filter(
        (prevContact) => !ids.includes(prevContact.id)
      );

      setContacts(updatedContacts);
      setStartingIndex(
        startingIndex - ids.length < 0 ? 0 : startingIndex - ids.length
      );

      toast.success("Contacts deleted successfully.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      onClose?.();
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <span className="w-full p-2 text-sm rounded cursor-pointer hover:bg-secondary">
          Delete
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {/* className="break-all" */}
            <p>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-semibold">{ids.length}</span> selected
              contact{ids.length > 1 ? "s" : ""}.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
