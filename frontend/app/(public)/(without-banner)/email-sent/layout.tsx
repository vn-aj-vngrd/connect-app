import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Sent",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
