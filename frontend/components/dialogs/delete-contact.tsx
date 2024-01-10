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
import { deleteContact } from "@/app/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useContactStore } from "@/store/useContactStore";

type Props = {
  id: number;
  name: string;
  isIcon?: boolean;
  redirectToAll?: boolean;
  onClose?: () => void;
};

export function DeleteContact({
  id,
  name,
  isIcon,
  redirectToAll = false,
  onClose,
}: Props) {
  const {
    setContact,
    setContacts,
    contacts: prevContacts,
    setStartingIndex,
    startingIndex,
  } = useContactStore((state) => state);

  const [open, setOpen] = useState<boolean>(false);

  async function handleDelete() {
    try {
      await deleteContact(id, redirectToAll);

      const updatedContacts = prevContacts.filter(
        (prevContact) => prevContact.id !== id
      );

      setContacts(updatedContacts);
      setContact(null);
      setStartingIndex(startingIndex - 1 < 0 ? 0 : startingIndex - 1);

      toast.success("Contact deleted successfully.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

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
        {isIcon ? (
          <Button variant="ghost" size="icon" className="rounded-full">
            <TrashIcon className="w-5 h-5" />
          </Button>
        ) : (
          <span className="w-full p-2 text-sm rounded cursor-pointer hover:bg-secondary">
            Delete
          </span>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent
        onCloseAutoFocus={() => {
          onClose?.();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {/* className="break-all" */}
            <p>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{name}</span> from your contacts.
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
