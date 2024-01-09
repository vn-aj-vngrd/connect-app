import { TagWithId } from "@/app/actions";
import { create } from "zustand";

type TagStore = {
  tags: TagWithId[];
  setTags: (contacts: TagWithId[]) => void;
};

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
}));
