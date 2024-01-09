"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function SettingsNavBar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 left-0 flex flex-col justify-between h-screen gap-5 px-2.5 py-5 overflow-y-auto border-r md:px-5 md:py-10 min-w-fit bg-background border-r-foreground/10 overflow-x-hidden">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col">
          <h3 className="w-full mb-2 ml-4 font-semibold md:text-xl">
            User Settings
          </h3>

          <div className="flex flex-col gap-1.5">
            <Link href="/user-settings/account">
              <Button
                className="flex justify-start w-full"
                variant={
                  pathname === "/user-settings/account" ? "secondary" : "ghost"
                }
              >
                Account
              </Button>
            </Link>
            <Link href="/user-settings/profile">
              <Button
                className="flex justify-start w-full"
                variant={
                  pathname === "/user-settings/profile" ? "secondary" : "ghost"
                }
              >
                Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="w-full mb-2 ml-4 font-semibold md:text-xl">
            App Settings
          </h3>

          <div className="flex flex-col gap-1.5">
            <Link href="/app-settings/theme">
              <Button
                className="flex justify-start w-full"
                variant={
                  pathname === "/app-settings/theme" ? "secondary" : "ghost"
                }
              >
                Theme
              </Button>
            </Link>

            <Link href="/app-settings/view">
              <Button
                className="flex justify-start w-full"
                variant={
                  pathname === "/app-settings/view" ? "secondary" : "ghost"
                }
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">Connect</p>{" "}
        <div>
          <span className="relative flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
