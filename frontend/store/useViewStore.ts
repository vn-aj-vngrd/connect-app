import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

type ViewStore = {
  view: "comfortable" | "compact";
  setView: (view: "comfortable" | "compact") => void;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
};

export const useViewstore = create<ViewStore>()(
  persist(
    (set) => ({
      view: "comfortable",
      setView: (view: "comfortable" | "compact") => set({ view }),
      isPreview: true,
      setIsPreview: (isPreview: boolean) => set({ isPreview }),
    }),
    {
      name: "view-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
