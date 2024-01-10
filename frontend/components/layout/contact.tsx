"use client";

import { ContactWithTags, favoriteContact } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  CopyIcon,
  GlobeIcon,
  MailIcon,
  MoreVerticalIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContactForm } from "../forms/contact-form";
import { useRouter } from "next/navigation";
import { DeleteContact } from "../dialogs/delete-contact";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tag } from "../actions/tag";
import { Favorite } from "../actions/favorite";
import { Export } from "../actions/export";

type Props = {
  contact: ContactWithTags;
};

export function Contact({ contact }: Props) {
  const router = useRouter();

  const initials =
    (contact.firstName?.[0] || "") + (contact.lastName?.[0] || "");

  async function handleFavorite() {
    try {
      await favoriteContact(contact.id);

      if (!contact.isFavorite)
        toast.success("Contact added to your favorites", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      else
        toast.success("Contact removed from your favorites", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
    } catch {
      toast.error("Failed to favorite contact", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }

  function copyToClipboard(text: string) {
    if (text === "Not Available" || !text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      })
      .catch((error) => {
        toast.error("Failed to copy to clipboard", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      });
  }

  function formatAddress(address: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  }) {
    if (
      !address.street &&
      !address.city &&
      !address.province &&
      !address.postalCode &&
      !address.country
    ) {
      return "Not Available";
    }

    const { street, city, province, postalCode, country } = address;

    const addressArray = [street, city, province, postalCode, country];

    const formattedAddress = addressArray
      .filter((address) => address)
      .join(", ");

    return formattedAddress;
  }

  return (
    <div className="px-5 pb-5">
      {/* Actions */}
      <div className="flex flex-row justify-between w-full py-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-row items-center">
          <Tag
            ids={[contact.id]}
            selectedTagIds={contact?.tags?.map((tag) => tag.id) || []}
          />

          <Favorite
            ids={[contact.id]}
            isFavorite={contact.isFavorite || false}
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full hover:bg-secondary">
              <MoreVerticalIcon className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1">
              <ContactForm contact={contact} type="edit" />

              <Export contact={contact} />

              <DropdownMenuSeparator />

              <DeleteContact
                id={contact.id}
                name={contact.firstName + " " + (contact?.lastName || "")}
                redirectToAll
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-5">
        {/* Profile */}
        <div className="flex flex-row items-end w-full gap-5">
          <Avatar className="flex items-center justify-center rounded-full w-36 h-36 bg-secondary ">
            <AvatarImage
              className="rounded-full bg-secondary"
              src={
                contact?.image
                  ? `data:image/png;base64,${contact?.image}`
                  : undefined
              }
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start justify-start gap-3">
              <h3 className="text-4xl font-semibold md:text-7xl text-foreground">
                {contact.firstName} {contact.lastName}
              </h3>

              <div className="flex flex-row gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full"
                        variant="outline"
                        disabled={contact?.phoneNumber ? false : true}
                      >
                        <a
                          href={`tel:${contact?.phoneNumber}`}
                          className="flex items-center justify-center w-full h-full"
                        >
                          <PhoneIcon className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full"
                        variant="outline"
                        disabled={contact?.email ? false : true}
                      >
                        <a
                          href={`mailto:${contact?.email}`}
                          className="flex items-center justify-center w-full h-full"
                        >
                          <MailIcon className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Email</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full"
                        variant="outline"
                        disabled={contact?.website ? false : true}
                      >
                        <a
                          href={`${contact?.website}`}
                          target="_blank"
                          className="flex items-center justify-center w-full h-full"
                        >
                          <GlobeIcon className="w-5 h-5" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Website</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b" />

        {/* Contact Information */}
        <div className="flex flex-col w-full gap-3 md:w-1/2">
          <Button
            className="flex items-center justify-start w-full gap-2 text-foreground"
            variant="outline"
            onClick={() => {
              if (!contact?.phoneNumber) return;
              copyToClipboard(contact?.phoneNumber);
            }}
          >
            <PhoneIcon className="w-5 h-5" />

            <div className="flex flex-col overflow-clip">
              <p className="text-sm truncate">
                {contact?.phoneNumber || "Not Available"}
              </p>
            </div>
          </Button>

          <Button
            className="flex items-center justify-start w-full gap-2 text-foreground"
            variant="outline"
            onClick={() => {
              if (!contact?.email) return;
              copyToClipboard(contact?.email);
            }}
          >
            <MailIcon className="w-5 h-5" />

            <div className="flex flex-col overflow-clip">
              <p className="text-sm truncate">
                {contact?.email || "Not Available"}
              </p>
            </div>
          </Button>

          <Button
            className="flex items-center justify-start w-full gap-2 text-foreground"
            variant="outline"
            onClick={() => {
              if (!contact?.website) return;
              copyToClipboard(contact?.website);
            }}
          >
            <GlobeIcon className="flex-shrink-0 w-5 h-5" />

            <div className="flex flex-col overflow-clip">
              <p className="text-sm truncate">
                {contact?.website || "Not Available"}
              </p>
            </div>
          </Button>
        </div>

        <div className="border-b" />

        {/* Delivery Address */}
        <div className="flex flex-col w-full gap-2 md:w-1/2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Delivery Address</h3>

            {formatAddress({
              street: contact?.deliveryAddress?.street,
              city: contact?.deliveryAddress?.city,
              province: contact?.deliveryAddress?.province,
              postalCode: contact?.deliveryAddress?.postalCode,
              country: contact?.deliveryAddress?.country,
            }) !== "Not Available" && (
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onClick={() => {
                  copyToClipboard(
                    formatAddress({
                      street: contact?.deliveryAddress?.street,
                      city: contact?.deliveryAddress?.city,
                      province: contact?.deliveryAddress?.province,
                      postalCode: contact?.deliveryAddress?.postalCode,
                      country: contact?.deliveryAddress?.country,
                    })
                  );
                }}
              >
                <CopyIcon className="w-3.5 h-3.5 cursor-pointer" />
              </Button>
            )}
          </div>

          <p className="text-sm text-wrap">
            {formatAddress({
              street: contact?.deliveryAddress?.street,
              city: contact?.deliveryAddress?.city,
              province: contact?.deliveryAddress?.province,
              postalCode: contact?.deliveryAddress?.postalCode,
              country: contact?.deliveryAddress?.country,
            })}
          </p>
        </div>

        {/* Billing Address */}
        <div className="flex flex-col w-full gap-2 md:w-1/2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Billing Address</h3>

            {formatAddress({
              street: contact?.deliveryAddress?.street,
              city: contact?.deliveryAddress?.city,
              province: contact?.deliveryAddress?.province,
              postalCode: contact?.deliveryAddress?.postalCode,
              country: contact?.deliveryAddress?.country,
            }) !== "Not Available" && (
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onClick={() => {
                  copyToClipboard(
                    formatAddress({
                      street: contact?.billingAddress?.street,
                      city: contact?.billingAddress?.city,
                      province: contact?.billingAddress?.province,
                      postalCode: contact?.billingAddress?.postalCode,
                      country: contact?.billingAddress?.country,
                    })
                  );
                }}
              >
                <CopyIcon className="w-3.5 h-3.5 cursor-pointer" />
              </Button>
            )}
          </div>

          <p className="text-sm text-wrap">
            {formatAddress({
              street: contact?.billingAddress?.street,
              city: contact?.billingAddress?.city,
              province: contact?.billingAddress?.province,
              postalCode: contact?.billingAddress?.postalCode,
              country: contact?.billingAddress?.country,
            })}
          </p>
        </div>

        {/* Notes */}
        <div className="flex flex-col w-full gap-2 md:w-1/2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Notes</h3>

            {contact.notes && (
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onClick={() => {
                  copyToClipboard(contact.notes as string);
                }}
              >
                <CopyIcon className="w-3.5 h-3.5 cursor-pointer" />
              </Button>
            )}
          </div>

          <div>
            <p className="text-sm">{contact?.notes || "Not Available"}</p>
          </div>
        </div>

        <div className="border-b" />

        {/* Tags */}
        <div className="flex flex-col w-full gap-4 md:w-1/2">
          <h3 className="text-lg font-semibold">Tags</h3>

          {contact?.tags?.length === 0 ? (
            <div>
              <p className="text-sm">Not Available</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-start gap-2">
              {contact?.tags?.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
