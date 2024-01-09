import { CloseSettings } from "@/components/layout/close-settings";
import { SettingsNavBar } from "@/components/layout/settings-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex max-w-4xl m-auto">
      <CloseSettings />
      <SettingsNavBar />
      <div className="w-full min-h-screen">
        <div className="flex flex-col h-full gap-3 p-5 md:gap-5 md:p-10">
          {children}
        </div>
      </div>
    </section>
  );
}
