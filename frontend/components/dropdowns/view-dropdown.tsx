"use client";

import { useEffect, useState } from "react";
import { AlignLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useViewstore } from "@/store/useViewStore";

export function ViewDropdown() {
  const { view, setView, isPreview, setIsPreview } = useViewstore(
    (state) => state
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="secondary" size="icon" className="rounded-full">
        <AlignLeftIcon className="w-5 h-5 text-foreground" />
        <span className="sr-only">View</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <AlignLeftIcon className="w-5 h-5 text-foreground" />
                <span className="sr-only">View</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="mt-1 w-36">
        <DropdownMenuLabel className="px-2 py-2">Table View</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={view}
            onValueChange={(value) =>
              setView(value as "comfortable" | "compact")
            }
          >
            <DropdownMenuRadioItem value="comfortable">
              Comfortable
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">
              Compact
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2 py-2">
          Preview Mode
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={isPreview ? "true" : "false"}
            onValueChange={(value) =>
              setIsPreview(value === "true" ? true : false)
            }
          >
            <DropdownMenuRadioItem value="true">On</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="false">Off</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
