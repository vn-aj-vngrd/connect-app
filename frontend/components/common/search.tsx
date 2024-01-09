"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchValue("");
    }
  }, [pathname]);

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value) return;

    if (event.key === "Enter") {
      router.push(`/search/${event.currentTarget.value}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute w-5 h-5 transform translate-y-[50%] left-3 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Contact"
        className="pl-10"
        onKeyDown={handleSearch}
        onChange={handleChange}
        value={searchValue}
      />
    </div>
  );
}
