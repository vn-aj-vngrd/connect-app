import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadIcon, ImageIcon, TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const MAX_FILE_SIZE = 1048576;

type Props = {
  className?: string;
  defaultValue?: string | null;
  onImageUpload?: (base64: string) => void;
  onImageRemove?: () => void;
  disabled?: boolean;
};

export function ImageUploader({
  className,
  defaultValue,
  onImageUpload,
  onImageRemove,
}: Props) {
  const [preview, setPreview] = useState<string | null | undefined>(
    defaultValue
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 1MB.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString();

        setPreview(base64);
        onImageUpload?.(base64?.split(",")[1] as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    document.getElementById("upload")?.click();
  };

  const handleRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    onImageRemove?.();
    setPreview("");
  };

  return (
    <div className={cn(className)}>
      <div className="inline-block w-full h-full rounded-md group">
        <div className="relative w-full h-full overflow-hidden">
          <input
            type="file"
            accept="image/*"
            id="upload"
            className="hidden"
            onChange={handleFileInput}
          />

          {preview ? (
            <div className="flex flex-row gap-5">
              <Image
                src={preview}
                className={
                  "h-[100px] w-[100px] rounded-full object-cover border"
                }
                width={100}
                height={100}
                alt=""
              />

              <div className="flex flex-row items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full"
                  variant="outline"
                  onClick={handleUploadImage}
                >
                  <label
                    htmlFor="upload"
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                  >
                    <UploadIcon
                      height={20}
                      width={20}
                      className="text-muted-foreground"
                    />
                  </label>
                </Button>

                <Button
                  onClick={handleRemoveImage}
                  size="icon"
                  className="rounded-full"
                  variant="outline"
                >
                  <TrashIcon
                    height={20}
                    width={20}
                    className="text-muted-foreground"
                  />
                </Button>
              </div>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor="upload"
                    className="flex h-[100px] w-[100px] flex-col items-center justify-center gap-[10px] border-[2px] border-dashed bg-background object-cover font-medium  transition-all duration-100 ease-in group-hover:opacity-50 py-8 cursor-pointer rounded-full"
                  >
                    <ImageIcon
                      strokeWidth={2}
                      height={35}
                      width={35}
                      className="min-h-[35px] min-w-[35px] opacity-20"
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
