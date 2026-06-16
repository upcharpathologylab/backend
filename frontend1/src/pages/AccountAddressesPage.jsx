import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Plus, ShieldCheck } from "lucide-react";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AddNewCard from "../components/account/AddNewCard.jsx";
import AddressCard from "../components/account/AddressCard.jsx";
import AddressFormModal from "../components/account/AddressFormModal.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { AUTH_TOKEN_KEY } from "../components/auth/authStorage.js";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  makeUserAddressPrimary,
  updateUserAddress
} from "../api/api.js";
import { loadAccountData, makeLocalId, normalizeAddress, saveAccountData } from "../utils/accountData.js";

const hasToken = () => Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

const toAddressPayload = (address) => ({
  type: address.type || address.label || "Other",
  label: address.label || address.type || "Other",
  name: address.name || "",
  addressLine1: address.addressLine1 || address.addressLine || "",
  addressLine2: address.addressLine2 || "",
  landmark: address.landmark || "",
  city: address.city || "",
  state: address.state || "",
  pincode: address.pincode || "",
  country: address.country || "India",
  phone: address.phone || "",
  isPrimary: Boolean(address.isPrimary || address.primary)
});

const ensurePrimaryAfterDelete = (addresses) => {
  if (!addresses.length || addresses.some((address) => address.isPrimary)) return addresses;
  return addresses.map((address, index) => ({ ...address, isPrimary: index === 0, primary: index === 0 }));
};

function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState("");
  const [addressModal, setAddressModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);

  useEffect(() => {
    document.title = "Manage Addresses | Upchar Pathology";
    if (!hasToken()) {
      const localData = loadAccountData();
      setAddresses(localData.addresses);
    }

    async function loadAddresses() {
      if (!hasToken()) {
        setUsingLocalFallback(true);
        setLoading(false);
        return;
      }

      try {
        const apiAddresses = await getUserAddresses();
        setAddresses(apiAddresses.map(normalizeAddress));
        setUsingLocalFallback(false);
      } catch {
        setUsingLocalFallback(true);
        setError("Could not sync addresses from server. Showing saved local data.");
      } finally {
        setLoading(false);
      }
    }

    loadAddresses();
  }, []);

  const summary = useMemo(() => {
    const total = addresses.length;
    const primary = addresses.filter((address) => address.isPrimary || address.primary).length;
    const office = addresses.filter((address) => (address.type || address.label) === "Office").length;
    const other = addresses.filter((address) => !["Home", "Office"].includes(address.type || address.label)).length;
    return { total, primary, office, other };
  }, [addresses]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const commitAddresses = (nextAddresses) => {
    const normalized = nextAddresses.map(normalizeAddress);
    setAddresses(normalized);
    saveAccountData({ addresses: normalized });
  };

  const saveAddress = async (values) => {
    const normalized = normalizeAddress({
      ...values,
      id: values.id || makeLocalId("address"),
      isPrimary: Boolean(values.isPrimary || values.primary)
    });

    try {
      if (hasToken() && !usingLocalFallback) {
        const savedAddress = values.id
          ? await updateUserAddress(values._id || values.id, toAddressPayload(normalized))
          : await createUserAddress(toAddressPayload(normalized));
        const current = values.id ? addresses.filter((address) => address.id !== values.id) : addresses;
        const next = [...current, normalizeAddress(savedAddress)];
        commitAddresses(normalized.isPrimary ? next.map((item) => ({ ...item, isPrimary: item.id === normalizeAddress(savedAddress).id })) : next);
      } else {
        const withoutExisting = addresses.filter((address) => address.id !== normalized.id);
        const next = [...withoutExisting, normalized];
        commitAddresses(normalized.isPrimary ? next.map((item) => ({ ...item, isPrimary: item.id === normalized.id, primary: item.id === normalized.id })) : next);
      }
      setAddressModal(null);
      showToast(values.id ? "Address updated successfully." : "Address added successfully.");
    } catch {
      showToast("Could not save address. Please try again.");
    }
  };

  const makePrimary = async (address) => {
    try {
      if (hasToken() && !usingLocalFallback) {
        await makeUserAddressPrimary(address._id || address.id);
      }
      commitAddresses(addresses.map((item) => ({ ...item, isPrimary: item.id === address.id, primary: item.id === address.id })));
      setMenuOpenId("");
      showToast("Primary address updated successfully.");
    } catch {
      showToast("Could not update primary address.");
    }
  };

  const deleteAddress = async () => {
    if (!deleteTarget) return;

    try {
      if (hasToken() && !usingLocalFallback) {
        await deleteUserAddress(deleteTarget._id || deleteTarget.id);
      }
      const next = ensurePrimaryAfterDelete(addresses.filter((address) => address.id !== deleteTarget.id));
      commitAddresses(next);
      setDeleteTarget(null);
      setMenuOpenId("");
      showToast("Address deleted successfully.");
    } catch {
      showToast("Could not delete address.");
    }
  };

  return (
    <AccountLayout
      active="addresses"
      breadcrumbCurrent="Addresses"
      title="Manage Addresses"
      subtitle="View, add, edit or delete your saved addresses."
      actions={
        <button
          type="button"
          onClick={() => setAddressModal({})}
          className="inline-flex h-12 items-center gap-3 rounded-lg bg-upchar-blue px-6 text-sm font-black text-white shadow-lg shadow-blue-900/15 transition hover:bg-navy-800"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Addresses" value={summary.total} icon="MapPin" color="blue" />
        <SummaryCard title="Primary Address" value={summary.primary} icon="Home" color="green" />
        <SummaryCard title="Office Address" value={summary.office} icon="Building2" color="blue" />
        <SummaryCard title="Other Address" value={summary.other} icon="UsersRound" color="purple" />
      </section>

      {error ? <p className="rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-navy-800">{error}</p> : null}

      {loading ? (
        <section className="rounded-lg border border-blue-100 bg-white p-8 text-center text-sm font-black text-navy-700 shadow-sm">
          Loading addresses...
        </section>
      ) : addresses.length ? (
        <section className="grid gap-5">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              menuOpen={menuOpenId === address.id}
              onToggleMenu={(id) => setMenuOpenId((current) => (current === id ? "" : id))}
              onEdit={(selectedAddress) => setAddressModal(selectedAddress)}
              onDelete={(selectedAddress) => setDeleteTarget(selectedAddress)}
              onMakePrimary={makePrimary}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-navy-900">No saved addresses</h2>
          <p className="mt-2 text-sm font-semibold text-navy-700">Add an address to make booking faster.</p>
        </section>
      )}

      <AddNewCard title="Add New Address" text={"Add your new address\nfor easy booking"} onClick={() => setAddressModal({})} />

      <section className="grid gap-4 rounded-lg border border-green-100 bg-green-50/50 p-6 shadow-sm sm:grid-cols-[64px_1fr]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-black text-upchar-green">Primary Address</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            This address will be used for auto-selection during booking.
          </p>
        </div>
      </section>

      <TrustStrip />

      {addressModal ? (
        <AddressFormModal
          address={addressModal.id ? addressModal : null}
          onClose={() => setAddressModal(null)}
          onSave={saveAddress}
        />
      ) : null}
      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Address"
          message={`Are you sure you want to delete ${deleteTarget.type || deleteTarget.label} address?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteAddress}
        />
      ) : null}

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[140] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-navy-950 px-5 py-3 text-center text-sm font-black text-white shadow-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AccountLayout>
  );
}

export default AccountAddressesPage;
