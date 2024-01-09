"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useViewstore } from "@/store/useViewStore";
import { useEffect, useState } from "react";

export function View() {
  const { view, setView } = useViewstore((state) => state);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <RadioGroup defaultValue={view} className="gap-5">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-center gap-5">
          <RadioGroupItem
            value="comfortable"
            id="r1"
            onClick={() => setView("comfortable")}
          />
          <Label htmlFor="r1" className="font-semibold ">
            Comfortable
          </Label>
        </div>
        <p className="text-sm ml-9">
          The comfortable view is the default view for the app. It is more
          relaxed and easier on the eyes.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center justify-center gap-5">
          <RadioGroupItem
            value="compact"
            id="r2"
            onClick={() => setView("compact")}
          />
          <Label htmlFor="r2" className="font-semibold ">
            Compact
          </Label>
        </div>
        <p className="text-sm ml-9">
          The compact view is a more dense view of the app. It is more
          information-dense and is more suitable for power users.
        </p>
      </div>
    </RadioGroup>
  );
}
