"use client";

import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;

      const res = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        return router.push("/login");
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
    }
  }

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
      <div className="flex items-center w-full gap-4">
        <div className="p-2 rounded-full bg-secondary">
          <LogOutIcon className="w-5 h-5 text-foreground" />
        </div>
        <span className="font-medium">Log out</span>
      </div>
    </DropdownMenuItem>
  );
}
