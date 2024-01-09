import { Preview } from "@/components/switches/preview";
import { View } from "@/components/radios/view";

export default async function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold md:text-5xl">View</h1>
      <p className="text-sm md:text-base">
        Manage view settings. You can change the view of your app of either
        compact or comfortable.
      </p>

      <div className="border-b" />

      <View />

      <div className="border-b" />

      <Preview />
    </>
  );
}
