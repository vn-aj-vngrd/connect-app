import AccountSettings from "@/components/common/account-settings";
export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold md:text-5xl">Account</h1>
      <p className="text-sm md:text-base">
        Manage account settings, change your email, password, export contacts,
        or delete your account.
      </p>

      <div className="border-b" />

      <AccountSettings />
    </>
  );
}
