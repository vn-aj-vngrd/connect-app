/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useContactStore } from "@/store/useContactStore";
import {
  ChevronRightIcon,
  CopyIcon,
  GlobeIcon,
  MailIcon,
  MaximizeIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { favoriteContact } from "@/app/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "react-responsive";
import { Favorites } from "../actions/favorites";

export function ContactPreview() {
  const pathname = usePathname();

  const {
    setContacts,
    setContact,
    contact,
    contacts: prevContacts,
  } = useContactStore((state) => state);

  useEffect(() => {
    setContact(null);
  }, [pathname]);

  async function handleFavorite() {
    try {
      await favoriteContact(contact!.id);

      const updatedContacts =
        pathname === "/favorites"
          ? prevContacts.filter((prevContact) => prevContact.id !== contact!.id)
          : prevContacts.map((prevContact) => {
              if (prevContact.id === contact!.id) {
                return {
                  ...prevContact,
                  isFavorite: !prevContact.isFavorite,
                };
              }

              return prevContact;
            });

      const updatedContact = updatedContacts.find(
        (_contact) => _contact.id === contact!.id
      );

      setContacts(updatedContacts);
      setContact(updatedContact || null);

      toast.success(
        contact?.isFavorite
          ? "Contact removed from your favorites"
          : "Contact added to your favorites",
        {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        }
      );
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
        console.error(error);
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
    <div
      className={`transition-all overflow-x-hidden ease-out duration-300 bg-background fixed md:sticky top-0 right-0 h-screen overflow-y-auto border-l z-20 ${
        contact ? "w-96" : "w-0"
      }`}
    >
      <ScrollArea className="h-full px-5 pt-2 pb-5">
        {/* Actions */}
        <div className="flex flex-row items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setContact(null)}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div>
            <Favorites
              ids={[contact?.id || 0]}
              isFavorite={contact?.isFavorite || false}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/contacts/${contact?.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MaximizeIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Contact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Profile*/}
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  contact?.image
                    ? `data:image/png;base64,${contact?.image}`
                    : undefined
                }
              />
              <AvatarFallback>
                {contact?.firstName[0] || ""}
                {contact?.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <div>
              <p className="w-full text-2xl font-semibold text-center truncate">
                {contact?.firstName} {contact?.lastName}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center w-full gap-5">
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

          <div className="border-b" />

          {/* Contact Detail*/}
          <div className="flex flex-col gap-5">
            {/* Contact Information */}
            <div className="flex flex-col gap-2">
              <Button
                className="flex items-center justify-start w-full gap-4 text-foreground"
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
                className="flex items-center justify-start w-full gap-4 text-foreground"
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
                className="flex items-center justify-start w-full gap-4 text-foreground"
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">Delivery Address</h3>
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">Billing Address</h3>
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">Notes</h3>

                {contact?.notes && (
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
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Tags</h3>

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
      </ScrollArea>
    </div>
  );
}
