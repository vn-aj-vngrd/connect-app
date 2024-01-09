import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
