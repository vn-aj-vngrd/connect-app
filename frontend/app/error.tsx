"use client"; // Error components must be Client Components

import { Title } from "@/components/layout/title";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full space-y-10">
        <Title title={"Something went wrong"} description={error?.message} />
        <div className="flex flex-row items-center justify-center gap-2">
          <Button onClick={() => router.push("/")} variant="outline">
            Go to home
          </Button>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
