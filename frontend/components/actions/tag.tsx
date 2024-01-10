"use client";

import { SaveAllIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tagContacts } from "@/app/actions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContactStore } from "@/store/useContactStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTagStore } from "@/store/useTagStore";
import { useState } from "react";

type Props = {
  ids: number[];
  selectedTagIds: number[];
  onClose?: () => void;
};

export function Tag({ ids, selectedTagIds: _selectedTagIds, onClose }: Props) {
  const [selectedTagIds, setSelectedTagIds] =
    useState<number[]>(_selectedTagIds);

  const {
    contact,
    setContacts,
    setContact,
    contacts: prevContacts,
  } = useContactStore((state) => state);

  const { tags } = useTagStore((state) => state);

  async function handleOnClick() {
    try {
      await tagContacts(ids, selectedTagIds);

      const selectedTags = tags.filter((tag) =>
        selectedTagIds.includes(tag.id)
      );

      const updatedContacts = prevContacts.map((prevContact) => {
        if (ids.includes(prevContact.id)) {
          return {
            ...prevContact,
            tags: selectedTags,
          };
        }

        return prevContact;
      });

      const updatedContact = updatedContacts.find(
        (updatedContact) => updatedContact.id === ids[0]
      );

      setContacts(updatedContacts);
      setContact(contact ? updatedContact || null : null);

      toast.success("Contact tags updated successfully.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

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
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <TagIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Tag Contact</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="min-w-fit" align="end">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag.id}
            checked={selectedTagIds.includes(tag.id)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={() => {
              setSelectedTagIds((prevSelectedTagIds) => {
                if (prevSelectedTagIds.includes(tag.id)) {
                  return prevSelectedTagIds.filter(
                    (prevSelectedTagId) => prevSelectedTagId !== tag.id
                  );
                }

                return [...prevSelectedTagIds, tag.id];
              });
            }}
            onChange={() => {}}
          >
            {tag.name}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <Button
          className="flex items-center justify-start w-full gap-2 font-normal rounded-lg cursor-pointer"
          onClick={handleOnClick}
        >
          <SaveAllIcon className="w-4 h-4" /> Save Changes
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
