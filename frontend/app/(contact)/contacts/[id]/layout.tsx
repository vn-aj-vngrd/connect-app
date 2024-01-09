import { getContact } from "@/app/actions";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = +params.id;

  const contact = await getContact(id);

  return {
    title: contact.firstName + " " + contact?.lastName,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
