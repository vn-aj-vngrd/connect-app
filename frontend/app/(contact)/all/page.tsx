import { getContacts } from "@/app/actions";
import { Header } from "@/components/layout/header";
import { ContactList } from "@/components/lists/contact-list/contact-list";
import { UsersIcon } from "lucide-react";

export default async function Page() {
  const { data: initialContacts, total } = await getContacts({});

  return (
    <div className="flex flex-col h-full">
      <Header
        title="All"
        subtitle="Contact List"
        icon={UsersIcon}
        description="This is a list of all your contacts."
        total={total}
      />

      <div className="flex-grow px-2 md:px-5">
        <ContactList initalContacts={initialContacts} total={total} />
      </div>
    </div>
  );
}
