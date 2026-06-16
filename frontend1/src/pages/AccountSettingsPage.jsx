import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import ChangePassword from "../components/account/settings/ChangePassword.jsx";
import Preferences from "../components/account/settings/Preferences.jsx";
import ProfileInformation from "../components/account/settings/ProfileInformation.jsx";
import SecuritySettings from "../components/account/settings/SecuritySettings.jsx";
import StatusBadge from "../components/account/StatusBadge.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import Icon from "../components/Icon.jsx";
import EditProfileModal from "../components/profile/EditProfileModal.jsx";
import { changeUserPassword, getUserProfile, updateUserProfile } from "../api/api.js";
import { AUTH_USER_KEY, clearAuthSession, getStoredUser } from "../components/auth/authStorage.js";
import { connectedAccounts } from "../data/accountPagesData.js";
import useAccountResource from "../hooks/useAccountResource.js";

const quickSettings = [
  { title: "Change Password", subtitle: "Update your password", icon: "LockKeyhole", tone: "green" },
  { title: "Enable 2FA", subtitle: "Add extra security", icon: "ShieldCheck", tone: "purple" },
  { title: "Download My Data", subtitle: "Get your account data", icon: "Download", tone: "orange" },
  { title: "Delete Account", subtitle: "Permanently delete", icon: "CircleX", tone: "red" }
];

const toneClasses = {
  green: "border-green-100 bg-green-50/60 text-upchar-green",
  orange: "border-orange-100 bg-orange-50/60 text-upchar-orange",
  purple: "border-violet-100 bg-violet-50/60 text-upchar-purple",
  red: "border-red-100 bg-red-50/60 text-upchar-red",
  blue: "border-blue-100 bg-blue-50/60 text-upchar-blue",
  navy: "border-blue-100 bg-white text-navy-900"
};

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  memberSince: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  avatarInitials: "",
  lastLogin: ""
};

const initialsFromProfile = (profile) =>
  profile.avatarInitials ||
  String(profile.fullName || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function SecurityBanner({ profile }) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-900 to-upchar-blue p-6 text-white shadow-card">
      <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-black text-upchar-blue shadow-sm">
            {initialsFromProfile(profile)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black">{profile.fullName}</h2>
              <StatusBadge label="Verified" />
            </div>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-blue-50">
              <span className="inline-flex items-center gap-3"><Icon name="Mail" className="h-5 w-5" />{profile.email}</span>
              <span className="inline-flex items-center gap-3"><Icon name="Phone" className="h-5 w-5" />{profile.phone}</span>
              <span className="inline-flex items-center gap-3"><Icon name="CalendarDays" className="h-5 w-5" />Member since {profile.memberSince}</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white/10 p-5">
          <ShieldCheck className="h-16 w-16 text-green-200" />
          <h3 className="mt-5 text-lg font-black">Your account is secure</h3>
          <p className="mt-2 text-sm font-semibold text-blue-50">Last login: {profile.lastLogin || "Not available"}</p>
        </div>
      </div>
    </section>
  );
}

function AccountSettingsPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const storedUser = getStoredUser();
  const { data: profile, setData: setProfile } = useAccountResource(
    getUserProfile,
    storedUser ? { ...emptyProfile, ...storedUser } : emptyProfile,
    []
  );

  useEffect(() => {
    document.title = "Account Settings | Upchar Pathology";
    if (!getStoredUser()) {
      navigate(`/?auth=signin&returnTo=${encodeURIComponent("/my-account/account-settings")}`, { replace: true });
    }
  }, [navigate]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const logout = () => {
    clearAuthSession();
    showToast("Logged out successfully");
    window.setTimeout(() => navigate("/"), 700);
  };

  const saveSessionProfile = (savedProfile) => {
    const currentUser = getStoredUser();
    if (!currentUser) return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...currentUser, ...savedProfile }));
    window.dispatchEvent(new Event("upchar-auth-user-updated"));
  };

  const handleProfileSave = async (values) => {
    try {
      await updateUserProfile(values);
      const savedProfile = await getUserProfile();
      setProfile((current) => ({ ...current, ...savedProfile }));
      saveSessionProfile(savedProfile);
      setProfileModalOpen(false);
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not update profile.");
    }
  };

  const handlePasswordSubmit = async (values) => {
    if (!values.currentPassword || !values.newPassword || values.newPassword !== values.confirmPassword) {
      showToast("Please enter matching password details.");
      return false;
    }

    try {
      await changeUserPassword(values);
      showToast("Password updated successfully.");
      return true;
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not update password.");
      return false;
    }
  };

  const profileConnectedAccounts = connectedAccounts.map((account) =>
    account.provider === "Google" ? { ...account, email: profile.email || "" } : account
  );

  return (
    <AccountLayout
      active="settings"
      breadcrumbCurrent="Account Settings"
      title="Account Settings"
      subtitle="Manage your account, security, and preferences"
      actions={
        <button type="button" onClick={logout} className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-6 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      }
    >
      <SecurityBanner profile={profile} />

      <div className="grid gap-5 xl:grid-cols-2">
        <ProfileInformation profile={profile} onEdit={() => setProfileModalOpen(true)} />
        <ChangePassword onSubmit={handlePasswordSubmit} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SecuritySettings onAction={(title) => showToast(`${title} selected.`)} />
        <Preferences onAction={(title) => showToast(`${title} selected.`)} />
      </div>

      <section className="rounded-lg border border-green-100 bg-green-50/40 p-5 shadow-sm lg:p-6">
        <h2 className="text-lg font-black text-upchar-green">Quick Actions</h2>
        <p className="mt-1 text-sm font-semibold text-navy-700">Useful actions to manage your account</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickSettings.map((item) => (
            <button
              type="button"
              className={`flex items-center gap-3 rounded-md border p-4 text-left transition hover:-translate-y-0.5 ${toneClasses[item.tone]}`}
              key={item.title}
              onClick={() => showToast(`${item.title} selected.`)}
            >
              <Icon name={item.icon} className="h-8 w-8" />
              <span>
                <span className="block text-sm font-black">{item.title}</span>
                <span className="mt-1 block text-xs font-semibold text-navy-700">{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-navy-900">Connected Accounts</h2>
            <p className="mt-1 text-sm font-semibold text-navy-600">Manage third-party accounts connected with your profile</p>
          </div>
          <button type="button" className="rounded-md border border-blue-100 px-4 py-2 text-sm font-black text-upchar-blue hover:bg-blue-50">
            Manage All
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {profileConnectedAccounts.map((account) => (
            <div className="rounded-lg border border-blue-100 p-4" key={account.provider}>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-black ${toneClasses[account.color] || toneClasses.blue}`}>
                  {account.provider.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-navy-900">{account.provider}</h3>
                  <p className="truncate text-xs font-semibold text-navy-600">{account.email}</p>
                </div>
              </div>
              <button type="button" className="mt-4 h-9 w-full rounded-md border border-blue-100 text-sm font-black text-upchar-blue hover:bg-blue-50">
                {account.status}
              </button>
            </div>
          ))}
        </div>
      </section>

      <TrustStrip />
      {profileModalOpen ? (
        <EditProfileModal profile={profile} onClose={() => setProfileModalOpen(false)} onSave={handleProfileSave} />
      ) : null}
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountSettingsPage;
