"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;

      await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
      });

      return router.push("/login");
    } catch (error: unknown) {
      const err = error as Error;

      toast.error(err.message || "Something went wrong.", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }
  useEffect(() => {
    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
