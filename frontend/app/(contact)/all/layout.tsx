import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
