import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlignLeftIcon,
  SettingsIcon,
  SunMoonIcon,
  UserIcon,
} from "lucide-react";
import { getUser } from "@/app/actions";
import { Logout } from "../dialogs/logout";
import Link from "next/link";

export async function UserDropdown() {
  const user = await getUser();

  const name = user?.firstName + " " + user?.lastName;
  const initials = (user?.firstName[0] || "") + (user?.lastName[0] || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            className="bg-secondary"
            src={user.image ? `data:image/png;base64,${user.image}` : undefined}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-1 min-w-[200px] p-5">
        <DropdownMenuLabel>
          <div className="flex flex-col items-center gap-5 mb-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                className="bg-secondary"
                src={
                  user.image ? `data:image/png;base64,${user.image}` : undefined
                }
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-lg text-center ">{name}</p>
              <p className="text-sm text-center text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Link
            href="/user-settings/account"
            className="flex items-center w-full h-full gap-4"
          >
            <div className="p-2 rounded-full bg-secondary">
              <SettingsIcon className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">Account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Link
            href="/user-settings/profile"
            className="flex items-center w-full h-full gap-4"
          >
            <div className="p-2 rounded-full bg-secondary">
              <UserIcon className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Link
            href="/app-settings/theme"
            className="flex items-center w-full h-full gap-4"
          >
            <div className="p-2 rounded-full bg-secondary">
              <SunMoonIcon className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">Theme</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Link
            href="/app-settings/view"
            className="flex items-center w-full h-full gap-4"
          >
            <div className="p-2 rounded-full bg-secondary">
              <AlignLeftIcon className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-medium">View</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
