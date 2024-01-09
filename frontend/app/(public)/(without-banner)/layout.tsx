export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col justify-between h-screen gap-5 py-10">
      <div className="flex justify-center flex-1">{children}</div>

      <footer className="flex justify-center w-full">
        <p className="text-sm">&copy; 2024 Connect. All rights reserved.</p>
      </footer>
    </section>
  );
}
