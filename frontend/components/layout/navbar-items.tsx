"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UsersIcon, StarIcon } from "lucide-react";

const navbarItems = [
  {
    name: "All",
    href: "/all",
    icon: UsersIcon,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: StarIcon,
  },
];

type Props = {
  name: string;
  href: string;
  icon: any;
};

function NavbarItem({ name, href, icon: Icon }: Props) {
  const pathname = usePathname();

  const path = pathname;
  const active = href.includes(path);
  const variant = active ? "secondary" : "ghost";

  return (
    <Link href={href}>
      <Button
        className="flex items-center justify-between w-full"
        variant={variant}
      >
        <div
          className={`flex flex-row items-center gap-3 ${
            active ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <Icon className="w-5 h-5" />
          {name}
        </div>
      </Button>
    </Link>
  );
}

export function NavbarItems() {
  return (
    <>
      {navbarItems.map((item) => (
        <NavbarItem
          key={item.name}
          name={item.name}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </>
  );
}
