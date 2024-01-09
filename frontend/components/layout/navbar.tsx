"use client";

import { ChevronLeftIcon, ChevronRightIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "../forms/contact-form";
import { TagList } from "../lists/tag-list";
import { NavbarItems } from "./navbar-items";
import { Search } from "../common/search";
import { TagWithId } from "@/app/actions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImportContactsForm } from "../forms/import-contacts-form";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  tags: TagWithId[];
};

export function Navbar({ tags }: Props) {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Adjust the threshold value as needed
      const isBelowThreshold = screenWidth > 1024;

      // Update the state based on the screen width
      setOpen(isBelowThreshold);
    };

    // Add an event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call the handleResize function to set the initial state
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-grow">
      <div
        className={`fixed md:sticky top-0 left-0 z-30 md:z-0 bg-background h-screen transition-all overflow-hidden duration-300 ease-out ${
          open ? "w-72" : "w-0"
        }`}
      >
        <div className="flex flex-col justify-between w-full h-full gap-5 px-5 py-3 border-r bg-background border-r-foreground/10">
          <div className="flex flex-col h-full gap-5">
            {/* Logo */}
            <div className="flex flex-row items-center justify-between gap-5">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/all") {
                    e.preventDefault();
                    e.nativeEvent.stopImmediatePropagation();
                  }
                }}
                className="flex flex-row items-center justify-center gap-3"
              >
                <ZapIcon className="w-6 h-6" />
                <h1 className="text-2xl font-bold ">Connect</h1>
              </Link>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setOpen(!open)}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close Sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Search */}
            <div className="mt-5">
              <Search />
            </div>

            <div className="border-b" />

            {/* Add Contact */}
            <div className="flex flex-col gap-2">
              <ContactForm type="add" />
              <ImportContactsForm />
            </div>

            <div className="border-b" />

            {/* Navbar Items */}
            <div className="flex flex-col gap-2">
              <NavbarItems />
            </div>

            <div className="border-b" />

            {/* Tags */}
            <div className="flex flex-grow h-full overflow-y-auto">
              <TagList tags={tags} />
            </div>

            {/* Footer */}
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">© Connect Inc.</p>

              <div>
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!open && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="sticky top-0 left-0 h-screen">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center h-full border-r w-[20px]"
                  onClick={() => setOpen(!open)}
                >
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              <p>Open Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
