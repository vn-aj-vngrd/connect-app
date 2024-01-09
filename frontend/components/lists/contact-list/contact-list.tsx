/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, MoreVerticalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { ContactWithTags, getContacts } from "@/app/actions";
import { useContactStore } from "@/store/useContactStore";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteContacts } from "../../dialogs/delete-contacts";
import { ExportContactsForm } from "../../forms/export-contacts-form";
import { useViewstore } from "@/store/useViewStore";
import { Favorites } from "../../actions/favorites";
import { Tags } from "../../actions/tags";
import { cn } from "@/lib/utils";
import { InitialSkeleton } from "./initial-skeleton";
import { EmptyState } from "./empty-state";
import { ContactOptions } from "./contact-options";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "react-responsive";

type Props = {
  initalContacts: ContactWithTags[];
  filters?: {
    [key: string]: any;
  };
  tagId?: number;
  search?: string;
  total: number;
};

export function ContactList({
  initalContacts,
  filters,
  tagId,
  search,
  total,
}: Props) {
  const { setContact, setContacts, contacts, startingIndex, setStartingIndex } =
    useContactStore((state) => state);

  const { isPreview } = useViewstore((state) => state);

  const { view } = useViewstore((state) => state);

  const pathname = usePathname();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const [ref, inView] = useInView();

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDescending, setSortDescending] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  async function loadMore() {
    const next = startingIndex + 10;

    const { data: newContacts } = await getContacts({
      startingIndex: next,
      filters,
      tagId,
      search,
      sortField: sortField || undefined,
      sortDescending,
    });

    if (newContacts?.length > 0) {
      setStartingIndex(next);
      setContacts([...contacts, ...newContacts]);
    }
  }

  async function reload() {
    setStartingIndex(0);

    const { data } = await getContacts({
      startingIndex: 0,
      filters,
      tagId,
      search,
      sortField: sortField || undefined,
      sortDescending,
    });

    setContacts(data);
  }

  function sort(field: string) {
    if (sortField === field) {
      setSortDescending(!sortDescending);
    } else {
      setSortField(field);
      setSortDescending(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (contacts.length === 0) {
      setContacts(initalContacts);
    }
  }, [initalContacts]);

  useEffect(() => {
    setStartingIndex(0);
    setContacts(initalContacts);
  }, [pathname]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  useEffect(() => {
    if (sortField) reload();
  }, [sortField, sortDescending]);

  const phone = useMediaQuery({
    query: "(min-width: 640px)",
  });

  const email = useMediaQuery({
    query: "(min-width: 1000px)",
  });

  const website = useMediaQuery({
    query: "(min-width: 1280px)",
  });

  if (!isMounted) {
    return <InitialSkeleton />;
  }

  if (contacts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 z-10 w-full bg-background">
          <TableRow className="border-none hover:bg-transparent ">
            {!!selectedIds.length ? (
              <>
                <TableHead colSpan={4}>
                  <div className="flex items-center">
                    <Checkbox
                      className={` items-center justify-center ${
                        view === "compact" ? "mr-3" : "ml-3 mr-8"
                      }`}
                      onClick={() => {
                        if (selectedIds.length === contacts.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(contacts.map((contact) => contact.id));
                        }
                      }}
                    />
                    {selectedIds.length} selected
                  </div>
                </TableHead>

                <TableHead className="flex items-center justify-end">
                  <Tags
                    ids={selectedIds}
                    selectedTagIds={
                      contacts
                        .find((contact) => contact.id === selectedIds[0])
                        ?.tags.map((tag) => tag.id) || []
                    }
                    onClose={() => {
                      setSelectedIds([]);
                    }}
                  />

                  <Favorites
                    ids={selectedIds}
                    isFavorite={
                      contacts.find((contact) => contact.id === selectedIds[0])
                        ?.isFavorite
                        ? true
                        : false
                    }
                    onClose={() => {
                      setSelectedIds([]);
                    }}
                  />

                  <DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger>
                            <Button size="icon" variant="ghost">
                              <MoreVerticalIcon className="w-5 h-5 " />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More Actions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <ExportContactsForm
                          ids={selectedIds}
                          onClose={() => {
                            setSelectedIds([]);
                          }}
                          isText
                        />
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <DeleteContacts
                          ids={selectedIds}
                          onClose={() => {
                            setSelectedIds([]);
                          }}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </>
            ) : (
              <>
                <TableHead className="group">
                  <button
                    onClick={() => sort("FirstName")}
                    className="flex items-center gap-2 cursor-default group-hover:text-foreground"
                  >
                    <h3>Name</h3>

                    {sortField === "FirstName" && (
                      <>
                        {sortDescending ? (
                          <ArrowDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        ) : (
                          <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        )}
                      </>
                    )}
                  </button>
                </TableHead>

                {phone && (
                  <TableHead className="group">
                    <button
                      onClick={() => sort("PhoneNumber")}
                      className="flex items-center gap-2 cursor-default group-hover:text-foreground"
                    >
                      <h3>Phone</h3>

                      {sortField === "PhoneNumber" && (
                        <>
                          {sortDescending ? (
                            <ArrowDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          )}
                        </>
                      )}
                    </button>
                  </TableHead>
                )}

                {email && (
                  <TableHead className="group">
                    <button
                      onClick={() => sort("Email")}
                      className="flex items-center gap-2 cursor-default group-hover:text-foreground"
                    >
                      <h3>Email</h3>

                      {sortField === "Email" && (
                        <>
                          {sortDescending ? (
                            <ArrowDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          )}
                        </>
                      )}
                    </button>
                  </TableHead>
                )}

                {website && (
                  <TableHead className="group">
                    <button
                      onClick={() => sort("Website")}
                      className="flex items-center gap-2 cursor-default group-hover:text-foreground"
                    >
                      <h3>Website</h3>

                      {sortField === "Website" && (
                        <>
                          {sortDescending ? (
                            <ArrowDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                          )}
                        </>
                      )}
                    </button>
                  </TableHead>
                )}

                <TableHead />
              </>
            )}
          </TableRow>

          <div className="absolute flex flex-1 w-full border-b" />
        </TableHeader>

        <TableBody>
          {contacts.map((contact, index) => (
            <TableRow
              key={index}
              className={`cursor-pointer relative group border-none ${
                view === "compact" ? "" : ""
              }`}
              onClick={() => {
                if (!phone) {
                  router.push(`/contacts/${contact.id}`);
                  return;
                }

                if (isPreview) setContact(contact);
                else router.push(`/contacts/${contact.id}`);
              }}
            >
              <TableCell className="min-w-[200px]">
                <div
                  className={`flex flex-row items-center  ${
                    view === "compact" ? "gap-2.5" : "gap-5"
                  }`}
                >
                  {!selectedIds.includes(contact.id) && (
                    <Avatar
                      className={`group-hover:hidden ${
                        view === "compact" ? "hidden" : ""
                      }`}
                    >
                      <AvatarImage
                        src={
                          contact?.image
                            ? `data:image/png;base64,${contact?.image}`
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        {contact.firstName[0] || ""}
                        {contact?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "items-center justify-center group-hover:flex",
                      selectedIds.includes(contact.id) ? "flex" : "hidden",
                      view === "compact" ? "flex" : "h-10 w-10"
                    )}
                  >
                    <Checkbox
                      checked={
                        selectedIds.length === contacts.length ||
                        selectedIds.includes(contact.id)
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        if (selectedIds.includes(contact.id)) {
                          setSelectedIds(
                            selectedIds.filter((id) => id !== contact.id)
                          );
                        } else {
                          setSelectedIds([...selectedIds, contact.id]);
                        }
                      }}
                    />
                  </div>

                  <h4 className="font-medium">
                    {contact.firstName + " " + (contact?.lastName || "")}
                  </h4>
                </div>
              </TableCell>

              {phone && <TableCell>{contact.phoneNumber}</TableCell>}

              {email && <TableCell>{contact.email}</TableCell>}

              {website && <TableCell>{contact.website}</TableCell>}

              <TableCell className="flex items-center justify-end">
                <ContactOptions contact={contact} view={view} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total > contacts.length && (
        <>
          {view === "compact" ? (
            <div ref={ref} className="flex flex-col">
              <div className="flex items-center gap-5 p-4">
                <div className="flex justify-between w-full gap-5">
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                </div>
              </div>
              <div className="flex items-center gap-5 p-4 px-4">
                <div className="flex justify-between w-full gap-5">
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                </div>
              </div>
            </div>
          ) : (
            <div ref={ref} className="flex flex-col">
              <div className="flex items-center gap-5 p-4">
                <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
                <div className="flex justify-between w-full gap-5">
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                </div>
              </div>
              <div className="flex items-center gap-5 p-4 px-4">
                <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
                <div className="flex justify-between w-full gap-5">
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                  <Skeleton className="flex flex-grow h-4" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
