import { ContactWithTags } from "@/app/actions";
import { create } from "zustand";

type ContactStore = {
  contact: ContactWithTags | null;
  setContact: (contact: ContactWithTags | null) => void;
  contacts: ContactWithTags[];
  setContacts: (contacts: ContactWithTags[]) => void;
  startingIndex: number;
  setStartingIndex: (startingIndex: number) => void;
};

export const useContactStore = create<ContactStore>((set) => ({
  contact: null,
  setContact: (contact) => set({ contact }),
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  startingIndex: 0,
  setStartingIndex: (startingIndex) => set({ startingIndex }),
}));
