"use client";

import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { favoriteContacts } from "@/app/actions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContactStore } from "@/store/useContactStore";
import { usePathname } from "next/navigation";

type Props = {
  ids: number[];
  isFavorite: boolean;
  onClose?: () => void;
};

export function Favorite({ ids, isFavorite, onClose }: Props) {
  const pathname = usePathname();

  const {
    contact,
    setContacts,
    setContact,
    contacts: prevContacts,
  } = useContactStore((state) => state);

  async function handleOnClick() {
    try {
      await favoriteContacts(ids, !isFavorite);

      const updatedContacts =
        pathname === "/favorites"
          ? prevContacts.filter((prevContact) => !ids.includes(prevContact.id))
          : prevContacts.map((prevContact) => {
              if (ids.includes(prevContact.id)) {
                return {
                  ...prevContact,
                  isFavorite: !prevContact.isFavorite,
                };
              }

              return prevContact;
            });

      const updatedContact = updatedContacts.find(
        (updatedContact) => updatedContact.id === ids[0]
      );

      setContacts(updatedContacts);
      setContact(contact ? updatedContact || null : null);

      toast.success(
        isFavorite
          ? `Selected contact${
              ids.length > 1 ? "s" : ""
            } removed from favorites`
          : `Selected contact${ids.length > 1 ? "s" : ""} added to favorites`,
        {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        }
      );

      onClose?.();
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleOnClick}
            className="rounded-full"
          >
            {isFavorite ? (
              <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarIcon className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isFavorite ? <p>Remove from favorites</p> : <p>Add to favorites</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
