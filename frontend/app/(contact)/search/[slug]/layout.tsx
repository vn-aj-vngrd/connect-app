import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Contact",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
