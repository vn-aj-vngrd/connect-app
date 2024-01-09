import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  className?: string;
  onFileUpload?: (file: File) => void;
  onFileRemove?: () => void;
  disabled?: boolean;
};

const MAX_FILE_SIZE = 26214400;

export function FileUploader({ className, onFileUpload }: Props) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith("application/json")) {
        toast.error("Please upload a JSON file.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 25MB.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      onFileUpload?.(selectedFile);
    }
  };

  return (
    <div className={cn(className)}>
      <Input type="file" accept="application/json" onChange={handleFileInput} />
    </div>
  );
}
