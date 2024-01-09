import { Title } from "@/components/layout/title";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  const title = "404";
  const description = "Oops, Sorry we can't find that page.";

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full space-y-10">
        <Title title={title} description={description} />

        <Link href="/login" className="w-full max-w-sm text-center">
          <Button className="w-full text-center">Get me out of here</Button>
        </Link>
      </div>
    </div>
  );
}
