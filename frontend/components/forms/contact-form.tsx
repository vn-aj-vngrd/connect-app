"use client";

import { Input } from "@/components/ui/input";
import { contactSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, StarIcon, Wand2Icon } from "lucide-react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUploader } from "../utils/image-uploader";
import { useEffect, useState } from "react";
import { Icons } from "../common/icons";
import { Country } from "country-state-city";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeUndefinedFields } from "@/utils";
import {
  ContactWithTags,
  TagWithId,
  addContact,
  editContact,
  getTags,
} from "@/app/actions";
import { TagForm } from "./tag-form";
import { useContactStore } from "@/store/useContactStore";
import { useTagStore } from "@/store/useTagStore";

type Props = {
  type: "add" | "edit";
  contact?: ContactWithTags;
  isEditIcon?: boolean;
  onClose?: () => void;
};

export function ContactForm({ type, contact, isEditIcon, onClose }: Props) {
  const {
    setContact,
    setContacts,
    contacts: prevContacts,
  } = useContactStore((state) => state);

  const { tags } = useTagStore((state) => state);

  const countries = Country.getAllCountries();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("63");

  const [selectedTags, setSeletedTags] = useState<TagWithId[]>(
    contact?.tags || []
  );

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        image: contact.image || null,
        firstName: contact.firstName || undefined,
        lastName: contact.lastName || undefined,
        phoneNumber: contact.phoneNumber || undefined,
        email: contact.email || undefined,
        deliveryAddress: {
          country: contact.deliveryAddress?.country || undefined,
          street: contact.deliveryAddress?.street || undefined,
          city: contact.deliveryAddress?.city || undefined,
          postalCode: contact.deliveryAddress?.postalCode || undefined,
          province: contact.deliveryAddress?.province || undefined,
          label: contact.deliveryAddress?.label || undefined,
        },
        billingAddress: {
          country: contact.billingAddress?.country || undefined,
          street: contact.billingAddress?.street || undefined,
          city: contact.billingAddress?.city || undefined,
          postalCode: contact.billingAddress?.postalCode || undefined,
          province: contact.billingAddress?.province || undefined,
          label: contact.billingAddress?.label || undefined,
        },
        website: contact.website || undefined,
        notes: contact.notes || undefined,
        tagIds: contact.tags?.map((tag) => tag.id) || [],
        isFavorite: contact.isFavorite || false,
      });
    }
  }, [contact, form]);

  async function onSubmit(formData: z.infer<typeof contactSchema>) {
    try {
      setIsPending(true);
      removeUndefinedFields(formData);

      if (type === "add") {
        await addContact(formData);

        toast.success("Contact added successfully.", {
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
        const updatedData = {
          ...formData,
          ...{
            id: contact!.id,
          },
        };

        await editContact(updatedData);

        const updatedContacts = prevContacts.map((prevContact) => {
          if (prevContact.id === contact!.id) {
            return {
              ...prevContact,
              ...updatedData,
              tags: selectedTags,
            };
          }

          return prevContact;
        });

        setContacts(updatedContacts);

        // const updatedContact = updatedContacts.find(
        //   (updatedContact) => updatedContact.id === contact!.id
        // );

        // setContact(contact ? updatedContact || null : null);

        toast.success("Contact updated successfully.", {
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

  function onImageUpload(base64: string) {
    form.setValue("image", base64, {
      shouldDirty: true,
    });
  }

  function onImageRemove() {
    form.setValue("image", null, {
      shouldDirty: true,
    });
  }

  function handleTagOnClick(tag: TagWithId) {
    const tagIds = form.getValues("tagIds");

    if (tagIds?.includes(tag.id)) {
      form.setValue(
        "tagIds",
        tagIds.filter((id) => id !== tag.id),
        {
          shouldDirty: true,
        }
      );

      setSeletedTags(
        selectedTags.filter((selectedTag) => selectedTag.id !== tag.id)
      );
    } else {
      form.setValue("tagIds", [...(tagIds ? tagIds : []), tag.id], {
        shouldDirty: true,
      });

      const selectedTag = tags.filter((_tag) => _tag.id === tag.id)[0];
      if (selectedTag) {
        setSeletedTags([...selectedTags, selectedTag]);
      }
    }
  }

  function handleFavoriteOnClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    form.setValue("isFavorite", !form.getValues("isFavorite"), {
      shouldDirty: true,
    });
  }

  const watchIsFavorite = form.watch("isFavorite");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {type === "add" ? (
        <DialogTrigger asChild>
          <Button className="flex items-center justify-center w-full gap-3 flex-grow-1">
            <Wand2Icon className="w-5 h-5 text-background" />
            Add Contact
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          {isEditIcon ? (
            <Button variant="ghost" size="icon" className="rounded-full">
              <PencilIcon className="w-5 h-5" />
            </Button>
          ) : (
            <span className="w-full p-2 text-sm rounded cursor-pointer hover:bg-secondary">
              Edit
            </span>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        className="overflow-auto max-h-[calc(100vh-96px)] w-full"
        onCloseAutoFocus={() => {
          form.reset();
          setSeletedTags([]);
          onClose?.();
        }}
      >
        <DialogHeader>
          {type === "add" ? (
            <>
              <DialogTitle className="text-2xl">Add Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to your list by filling up the form below.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-2xl">Edit Contact</DialogTitle>
              <DialogDescription>
                Edit {contact?.firstName}&apos;s contact by modifying the form
                below.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 py-4">
              <div className="ml-[40%]">
                <ImageUploader
                  defaultValue={
                    contact?.image
                      ? `data:image/png;base64,${contact?.image}`
                      : undefined
                  }
                  onImageUpload={onImageUpload}
                  onImageRemove={onImageRemove}
                />
              </div>

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <Select
                            defaultValue={
                              countries.find(
                                (country) => country.name === "Philippines"
                              )?.name || "Philippines"
                            }
                            onValueChange={(value) => {
                              setPhoneCode(
                                countries.find(
                                  (country) => country.name === value
                                )?.phonecode || "63"
                              );
                            }}
                          >
                            <SelectTrigger className="w-fit">
                              <span className="pr-2">
                                {
                                  countries.find(
                                    (country) => country.phonecode === phoneCode
                                  )?.flag
                                }
                              </span>
                            </SelectTrigger>

                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.name}
                                  value={country.name}
                                  className="flex"
                                >
                                  {country.flag} {country.name} (+
                                  {country.phonecode})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="text"
                            placeholder={
                              "+" +
                              countries.find(
                                (country) => country.phonecode === phoneCode
                              )?.phonecode
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress.country"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select a Country"
                              {...field}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.name}
                                value={country.name}
                                className="flex"
                              >
                                {country.flag} {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress.street"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Street" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress.city"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City/Municipality"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress.postalCode"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Postal Code/Zip Code"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress.province"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Province/State"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress.country"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.name}
                                value={country.name}
                                className="flex"
                              >
                                {country.flag} {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress.street"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Street" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress.city"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City/Municipality"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress.postalCode"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Postal Code/Zip Code"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="billingAddress.province"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Province/State"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Website" type="text" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notes" {...field} />
                      </FormControl>

                      <FormMessage className="pb-2" />
                    </FormItem>
                  </div>
                )}
              />

              <div className="flex flex-col w-full gap-3">
                <FormLabel>Tags</FormLabel>

                <div className="flex flex-row flex-wrap w-full gap-3">
                  {selectedTags.map((tag, index) => (
                    <Badge
                      className="cursor-pointer"
                      variant="outline"
                      key={index}
                      onClick={() => handleTagOnClick(tag)}
                    >
                      {tag.name}
                    </Badge>
                  ))}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 rounded-full w-fit"
                        size="sm"
                      >
                        <PlusIcon className="w-4 h-4 text-muted-foreground" />
                        Tag
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      {tags.map((tag, key) => (
                        <DropdownMenuCheckboxItem
                          key={key}
                          onSelect={(event) => event.preventDefault()}
                          checked={form.getValues("tagIds")?.includes(tag.id)}
                          onClick={() => handleTagOnClick(tag)}
                        >
                          {tag.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />

                      <TagForm type="add" isAddOnContact />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleFavoriteOnClick}
                    >
                      {watchIsFavorite ? (
                        <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {watchIsFavorite
                      ? "Remove from your favorites"
                      : "Add to your favorites"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {type === "add" ? (
                <Button
                  type="submit"
                  className="flex flex-1"
                  disabled={isPending}
                >
                  {isPending && (
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Add Contact
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex flex-1"
                  disabled={isPending || !form.formState.isDirty}
                >
                  {isPending && (
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
