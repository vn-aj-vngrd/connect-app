import { getUser } from "@/app/actions";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function Page() {
  const user = await getUser();

  return (
    <>
      <h1 className="text-2xl font-semibold md:text-5xl">Profile</h1>
      <p className="text-sm md:text-base">
        Manage your profile settings. You can change your profile image, name,
        or password.
      </p>

      <div className="border-b" />

      <div className="flex flex-col flex-grow">
        <ProfileForm user={user} />
      </div>
    </>
  );
}
