import { ContactForm } from "@/components/forms/contact-form";
import { ImportContactsForm } from "@/components/forms/import-contacts-form";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 m-auto w-fit">
      <div className="flex flex-col items-center justify-center gap-2">
        <h4 className="text-2xl font-bold">No Contacts Found</h4>
        <p className="text-sm text-muted-foreground">
          Start building your network by adding contacts
        </p>
      </div>

      <div className="flex flex-row items-center justify-center w-full gap-2">
        <ImportContactsForm />
        <ContactForm type="add" />
      </div>
    </div>
  );
}
