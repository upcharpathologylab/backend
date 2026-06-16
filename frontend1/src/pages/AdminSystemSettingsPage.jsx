import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CreditCard,
  Database,
  FileText,
  Globe,
  IndianRupee,
  Info,
  Languages,
  Mail,
  PencilLine,
  Phone,
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import FormModal from "../components/profile/FormModal.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AdminActionsCard, AdminInfoNotice } from "../components/admin/common/AdminInsightCards.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { generalSettingsRows, systemInfoRows, systemQuickActions, systemSettingCards } from "../data/adminSystemData.js";

const cardIcons = {
  bell: Bell,
  card: CreditCard,
  globe: Globe,
  settings: Settings,
  shield: ShieldCheck
};

const settingIcons = {
  "System Name": Building2,
  "System Email": Mail,
  "System Phone": Phone,
  Timezone: Globe,
  "Date Format": CalendarDays,
  Currency: IndianRupee,
  "Default Language": Languages,
  "Invoice Prefix": FileText,
  "Maintenance Mode": ToggleLeft,
  "Data Retention (Days)": Database,
  "Auto Backup": Database,
  "System Version": Info
};

function ConfirmActionModal({ action, onClose, onConfirm }) {
  return (
    <FormModal
      title={action}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white">
            Continue
          </button>
        </div>
      }
    >
      <p className="text-sm font-semibold leading-6 text-navy-700">
        Continue with <span className="font-black text-navy-950">{action}</span>? This local admin prototype will show a confirmation toast.
      </p>
    </FormModal>
  );
}

function EditSettingModal({ item, onClose, onSave }) {
  const [value, setValue] = useState(item?.value || "");

  return (
    <FormModal
      title={`Edit ${item.key}`}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(value)} className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white">
            Save Setting
          </button>
        </div>
      }
    >
      <label className="block">
        <span className="mb-2 block text-sm font-black text-navy-950">Value</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-12 w-full rounded-md border border-blue-100 px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue"
        />
      </label>
    </FormModal>
  );
}

function AdminSystemSettingsPage() {
  const [settingsRows, setSettingsRows] = useState(generalSettingsRows);
  const [editItem, setEditItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "System Settings | Upchar Admin";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const toggleSetting = (item) => {
    setSettingsRows((current) =>
      current.map((row) =>
        row.id === item.id
          ? {
              ...row,
              toggle: !row.toggle,
              value: !row.toggle ? "Enabled" : "Disabled"
            }
          : row
      )
    );
    showToast(`${item.key} updated.`);
  };

  const saveSetting = (value) => {
    setSettingsRows((current) => current.map((row) => (row.id === editItem.id ? { ...row, value } : row)));
    showToast(`${editItem.key} saved.`);
    setEditItem(null);
  };

  const quickAction = (item) => {
    if (["Clear System Cache", "Optimize Database", "Backup Now", "System Update"].includes(item)) {
      setConfirmAction(item);
      return;
    }
    showToast(`${item} opened.`);
  };

  return (
    <AdminLayout topbarTitle="System Settings" topbarBadge={null}>
      <p className="text-sm font-semibold text-navy-700">
        <span className="font-black text-navy-950">Dashboard</span>
        <span className="px-2 text-navy-400">&gt;</span>
        System Settings
      </p>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {systemSettingCards.map((card) => {
          const Icon = cardIcons[card.icon] || Settings;
          return (
            <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={card.title}>
              <div className="flex items-start gap-4">
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="h-8 w-8" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-navy-950">{card.title}</span>
                  <span className="mt-2 block text-xs font-semibold leading-5 text-navy-600">{card.text}</span>
                  <span className="mt-3 block text-xs font-black text-upchar-green">{card.count}</span>
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
          <h2 className="text-xl font-black text-navy-950">General Settings</h2>
          <p className="mt-1 text-sm font-semibold text-navy-600">Manage system general preferences and configurations.</p>

          <div className="mt-5 divide-y divide-blue-100">
            {settingsRows.map((item) => {
              const Icon = settingIcons[item.key] || Settings;
              return (
                <article className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,auto)_auto] md:items-center" key={item.id}>
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-upchar-green">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-navy-950">{item.key}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-navy-600">{item.description}</span>
                    </span>
                  </div>

                  <div className="text-sm font-black text-navy-950">
                    {typeof item.toggle === "boolean" ? (
                      <button type="button" onClick={() => toggleSetting(item)} className="inline-flex items-center gap-2" aria-label={`Toggle ${item.key}`}>
                        {item.toggle ? <ToggleRight className="h-8 w-8 text-upchar-green" /> : <ToggleLeft className="h-8 w-8 text-slate-400" />}
                        {item.value}
                      </button>
                    ) : (
                      item.value
                    )}
                  </div>

                  {item.badge ? (
                    <span className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-xs font-black text-navy-700">{item.badge}</span>
                  ) : (
                    <button type="button" onClick={() => setEditItem(item)} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-100 px-4 text-xs font-black text-upchar-green hover:bg-green-50">
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="grid content-start gap-5">
          <AdminActionsCard title="Quick Actions" items={systemQuickActions} onAction={quickAction} />

          <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-navy-950">System Information</h2>
            <div className="mt-5 divide-y divide-blue-100">
              {systemInfoRows.map(([label, value]) => (
                <div className="flex items-center justify-between gap-4 py-3 text-sm" key={label}>
                  <span className="font-semibold text-navy-600">{label}</span>
                  <span className="text-right font-black text-navy-950">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-6">
        <AdminInfoNotice
          title="Keep your system secure & up to date"
          text="Regularly back up your data and keep your system updated for better performance and security."
        />
      </div>

      {editItem ? <EditSettingModal item={editItem} onClose={() => setEditItem(null)} onSave={saveSetting} /> : null}

      {confirmAction ? (
        <ConfirmActionModal
          action={confirmAction}
          onClose={() => setConfirmAction("")}
          onConfirm={() => {
            showToast(`${confirmAction} completed.`);
            setConfirmAction("");
          }}
        />
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminSystemSettingsPage;
