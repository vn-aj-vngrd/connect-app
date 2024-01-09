"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [theme]);

  if (!isMounted) {
    return null;
  }

  return (
    <RadioGroup defaultValue={theme} className="gap-5">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-center gap-5">
          <RadioGroupItem
            value="light"
            id="r1"
            onClick={() => setTheme("light")}
          />
          <Label htmlFor="r1" className="font-semibold ">
            Light
          </Label>
        </div>
        <p className="text-sm ml-9">
          The light theme is the default theme of the app. If you prefer light
          mode then this is the theme for you.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-center gap-5">
          <RadioGroupItem
            value="dark"
            id="r2"
            onClick={() => setTheme("dark")}
          />
          <Label htmlFor="r2" className="font-semibold ">
            Dark
          </Label>
        </div>
        <p className="text-sm ml-9">
          The dark theme is the opposite of the light theme. If you prefer dark
          mode then this is the theme for you.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-center gap-5">
          <RadioGroupItem
            value="system"
            id="r3"
            onClick={() => setTheme("system")}
          />
          <Label htmlFor="r3" className="font-semibold ">
            System
          </Label>
        </div>
        <p className="text-sm ml-9">
          The system theme is the theme that follows your system settings. If
          you prefer to follow your system settings then this is the theme for
          you.
        </p>
      </div>
    </RadioGroup>
  );
}
