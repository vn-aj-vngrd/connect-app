import { ContactWithId } from "@/app/actions";
import { toast } from "sonner";

type Props = {
  contact: ContactWithId;
};

export function Export({ contact }: Props) {
  async function handleExport() {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/${contact.id}/export`;

      const res = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("No contact found.", {
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });

          return;
        }

        toast.error("Something went wrong.", {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        return;
      }

      const data = await res.blob();

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `${contact.firstName} ${contact.lastName || ""}.json`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      toast.success("Contact exported!", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } catch {
      toast.error("Failed to export contact", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  }

  return (
    <div
      onClick={handleExport}
      className="w-full p-2 text-sm rounded cursor-pointer hover:bg-secondary"
    >
      Export
    </div>
  );
}
