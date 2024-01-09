import { AlignLeftIcon, ZapIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserDropdown } from "../dropdowns/user-dropdown";
import { ThemeDropdown } from "../dropdowns/theme-dropdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ViewDropdown } from "../dropdowns/view-dropdown";

type Props = {
  title?: string;
  subtitle?: string;
  icon?: any;
  image?: string;
  description?: string;
  total?: number;
};

export function Header({
  title,
  subtitle,
  icon: Icon,
  image,
  description,
  total,
}: Props) {
  const initials = (title?.[0] || "") + (title?.[1] || "");

  return (
    <div className="flex flex-col gap-1 px-5 py-3 border-b">
      <div className="flex flex-row items-center justify-between">
        <Link href="/all" className="flex md:hidden">
          <ZapIcon className="w-5 h-5 text-foreground" />
        </Link>

        {subtitle && (
          <p className="hidden text-sm font-semibold md:flex">
            {subtitle}
          </p>
        )}

        <div className="flex flex-row items-center justify-center gap-3">
          <div>
            <ThemeDropdown />
          </div>

          <div>
            <ViewDropdown />
          </div>

          <div>
            <UserDropdown />
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex flex-row items-end w-full gap-5">
          {Icon && (
            <div className="min-w-[180px] min-h-[150px] rounded bg-secondary hidden items-center justify-center md:flex">
              <Icon className="w-12 h-12 text-foreground" />
            </div>
          )}

          {image && (
            <Avatar className="items-center justify-center rounded w-36 h-36 bg-secondary ">
              <AvatarImage className="bg-secondary" src={image} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}

          <div className="flex flex-col gap-2">
            {title && (
              <div className="flex flex-row items-end gap-3">
                <h3 className="text-4xl font-semibold md:text-8xl text-foreground">
                  {title}
                </h3>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="mb-1.5 md:mb-2 h-fit cursor-default"
                      >
                        {total}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {total && total > 1 ? `${total} contacts` : "0 contact"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
