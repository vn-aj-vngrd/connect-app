import { getContacts, getTag } from "@/app/actions";
import { Header } from "@/components/layout/header";
import { ContactList } from "@/components/lists/contact-list/contact-list";
import { SearchIcon } from "lucide-react";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const { data: initalContacts, total } = await getContacts({
    search: params.slug,
  });

  return (
    <div className="flex flex-col h-full">
      <Header
        title={params.slug}
        subtitle="Search Results"
        icon={SearchIcon}
        description="Search for a contact by name, email, address, or phone number."
        total={total}
      />

      <div className="flex-grow px-2 md:px-5">
        <ContactList
          initalContacts={initalContacts}
          search={params.slug}
          total={total}
        />
      </div>
    </div>
  );
}
