import { getContact } from "@/app/actions";
import { Contact } from "@/components/layout/contact";
import { Header } from "@/components/layout/header";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const id = +params.id;

  const contact = await getContact(id);

  return (
    <div className="flex flex-col h-full">
      <Header subtitle="Contact Information" />

      <Contact contact={contact} />
    </div>
  );
}
