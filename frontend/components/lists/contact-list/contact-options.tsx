import { ContactWithTags } from "@/app/actions";
import { Export } from "@/components/actions/export";
import { DeleteContact } from "@/components/dialogs/delete-contact";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ContactOptionsProps = {
  contact: ContactWithTags;
  view: "comfortable" | "compact";
};

export function ContactOptions({ contact, view }: ContactOptionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleView(contactId: number) {
    router.push(`/contacts/${contactId}`);
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`
                ${view === "compact" ? "h-7 w-7" : ""}
                `}
                >
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleView(contact.id)}
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <ContactForm
              type="edit"
              contact={contact}
              onClose={() => setOpen(false)}
            />
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Export contact={contact} />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <DeleteContact
              id={contact.id}
              name={contact.firstName + " " + (contact?.lastName || "")}
              onClose={() => setOpen(false)}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
