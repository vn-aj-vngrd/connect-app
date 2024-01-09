import { ContactPreview } from "@/components/layout/contact-preview";
import { Navbar } from "@/components/layout/navbar";
import { getTags } from "@/app/actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tags = await getTags();

  return (
    <section className="flex w-full">
      <Navbar tags={tags} />
      <div className="w-full h-screen overflow-x-hidden">{children}</div>
      <div className="flex flex-grow">
        <ContactPreview />
      </div>
    </section>
  );
}
