import { ChangeEmailForm } from "../forms/change-email-form";
import { ChangePasswordForm } from "../forms/change-password-form";
import { ExportContactsForm } from "../forms/export-contacts-form";
import { DeleteAccountForm } from "../forms/delete-account-form";

export default function AccountSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 md:items-center md:justify-between md:gap-10 md:flex-row">
        <div>
          <h4 className="font-semibold">Change Email</h4>
          <p className="mt-2 text-sm">
            Update your email address. We&apos;ll send a confirmation email to
            your new email address.
          </p>
        </div>

        <div>
          <ChangeEmailForm />
        </div>
      </div>

      <div className="flex flex-col gap-5 md:items-center md:justify-between md:gap-10 md:flex-row">
        <div>
          <h4 className="font-semibold">Change Password</h4>
          <p className="mt-2 text-sm">
            Update your password with a new one. Please use a strong password to
            keep your account secure.
          </p>
        </div>

        <div>
          <ChangePasswordForm />
        </div>
      </div>

      <div className="border-b" />

      <div className="flex flex-col gap-5 md:items-center md:justify-between md:gap-10 md:flex-row">
        <div>
          <h4 className="font-semibold">Export Contacts</h4>
          <p className="mt-2 text-sm">
            Download a backup of your contacts. You can use this file to import
            your contacts to same or another account.
          </p>
        </div>

        <div>
          <ExportContactsForm />
        </div>
      </div>

      <div className="border-b" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:items-center md:justify-between md:gap-10 md:flex-row">
          <div>
            <h4 className="font-semibold">Delete Account</h4>
            <p className="mt-2 text-sm">
              Delete your account and all associated data. This action is
              irreversible and will permanently delete your account.
            </p>
          </div>

          <div>
            <DeleteAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
