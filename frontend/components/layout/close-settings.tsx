"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CloseSettings() {
  const router = useRouter();

  function handleClose() {
    router.push("/all");
  }

  return (
    <div className="absolute right-0 md:right-10 md:top-10 top-[5px]">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={handleClose}
      >
        <XIcon className="w-5 h-5 " />
      </Button>
    </div>
  );
}
