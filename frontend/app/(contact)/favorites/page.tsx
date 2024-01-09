import { getContacts } from "@/app/actions";
import { Header } from "@/components/layout/header";
import { ContactList } from "@/components/lists/contact-list/contact-list";
import { StarIcon } from "lucide-react";

export default async function Page() {
  const { data: initalContacts, total } = await getContacts({
    filters: {
      isFavorite: true,
    },
  });

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Favorites"
        subtitle="Contact List"
        icon={StarIcon}
        description="This is a list of your favorite contacts."
        total={total}
      />

      <div className="flex-grow px-2 md:px-5">
        <ContactList
          initalContacts={initalContacts}
          filters={{
            isFavorite: true,
          }}
          total={total}
        />
      </div>
    </div>
  );
}
