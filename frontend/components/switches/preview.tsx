"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useViewstore } from "@/store/useViewStore";
import { useEffect, useState } from "react";

export function Preview() {
  const { isPreview, setIsPreview } = useViewstore((state) => state);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 md:items-center md:justify-between md:gap-10 md:flex-row">
      <div>
        <h4 className="font-semibold">Preview Contact</h4>
        <p className="mt-2 text-sm">
          {
            "Preview a contact's details when clicking a contact. This is useful if you want to quickly view a contact's details without having to open the contact's page. However, this will not work on mobile devices."
          }
        </p>
      </div>

      <div>
        <Switch
          checked={isPreview}
          onCheckedChange={() => setIsPreview(!isPreview)}
        />
      </div>
    </div>
  );
}
