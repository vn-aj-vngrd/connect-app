import { getContacts, getTag } from "@/app/actions";
import { Header } from "@/components/layout/header";
import { ContactList } from "@/components/lists/contact-list/contact-list";
import { TagIcon } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { data: initialContacts, total } = await getContacts({
    tagId: +params.id,
  });

  const tag = await getTag(+params.id);

  return (
    <div className="flex flex-col h-full">
      <Header
        title={tag?.name}
        subtitle="Tag"
        icon={TagIcon}
        description={`Keep up with your ${tag?.name} contacts.`}
        total={total}
      />

      <div className="flex-grow px-2 md:px-5">
        <ContactList
          initalContacts={initialContacts}
          tagId={tag.id}
          total={total}
        />
      </div>
    </div>
  );
}
