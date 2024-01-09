import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot your Password",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
