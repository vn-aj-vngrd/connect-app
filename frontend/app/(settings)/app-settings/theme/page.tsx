import { Theme } from "@/components/radios/theme";

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold md:text-5xl">Theme</h1>
      <p className="text-sm md:text-base">
        Manage your theme settings. You can change the theme of your app of
        either light, dark, or system default.
      </p>
      <div className="border-b" />

      <Theme />
    </>
  );
}
