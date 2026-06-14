import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Plus, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AddNewCard from "../components/account/AddNewCard.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import FamilyMemberCard from "../components/account/FamilyMemberCard.jsx";
import FamilyMemberFormModal from "../components/account/FamilyMemberFormModal.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { AUTH_TOKEN_KEY, clearAuthSession } from "../components/auth/authStorage.js";
import {
  createUserFamilyMember,
  deleteUserFamilyMember,
  getUserFamilyMembers,
  updateUserFamilyMember
} from "../api/api.js";
import { loadAccountData, makeLocalId, normalizeFamilyMember, saveAccountData } from "../utils/accountData.js";

const hasToken = () => Boolean(localStorage.getItem(AUTH_TOKEN_KEY));

const toFamilyPayload = (member) => ({
  fullName: member.fullName || member.name || "",
  relation: member.relation || "",
  dateOfBirth: member.dateOfBirth || "",
  gender: member.gender || "",
  bloodGroup: member.bloodGroup || "",
  avatar: member.avatar || ""
});

function AccountFamilyMembersPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [menuOpenId, setMenuOpenId] = useState("");
  const [memberModal, setMemberModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);

  useEffect(() => {
    document.title = "Family Members | Upchar Pathology";
    const localData = loadAccountData();
    setMembers(localData.familyMembers);

    async function loadMembers() {
      if (!hasToken()) {
        setUsingLocalFallback(true);
        setLoading(false);
        return;
      }

      try {
        const apiMembers = await getUserFamilyMembers();
        setMembers(apiMembers.map(normalizeFamilyMember));
        setUsingLocalFallback(false);
      } catch {
        setUsingLocalFallback(true);
        setError("Could not sync family members from server. Showing saved local data.");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  const summary = useMemo(() => {
    const total = members.length;
    const male = members.filter((member) => member.gender === "Male").length;
    const female = members.filter((member) => member.gender === "Female").length;
    const bloodGroups = new Set(members.map((member) => member.bloodGroup).filter(Boolean)).size;
    return { total, male, female, bloodGroups };
  }, [members]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const commitMembers = (nextMembers) => {
    const normalized = nextMembers.map(normalizeFamilyMember);
    setMembers(normalized);
    saveAccountData({ familyMembers: normalized });
  };

  const saveMember = async (values) => {
    const normalized = normalizeFamilyMember({
      ...values,
      id: values.id || makeLocalId("family")
    });

    try {
      if (hasToken() && !usingLocalFallback) {
        const savedMember = values.id
          ? await updateUserFamilyMember(values._id || values.id, toFamilyPayload(normalized))
          : await createUserFamilyMember(toFamilyPayload(normalized));
        commitMembers([...members.filter((member) => member.id !== normalized.id), normalizeFamilyMember(savedMember)]);
      } else {
        commitMembers([...members.filter((member) => member.id !== normalized.id), normalized]);
      }
      setMemberModal(null);
      showToast(values.id ? "Family member updated successfully." : "Family member added successfully.");
    } catch {
      showToast("Could not save family member. Please try again.");
    }
  };

  const deleteMember = async () => {
    if (!deleteTarget) return;

    try {
      if (hasToken() && !usingLocalFallback) {
        await deleteUserFamilyMember(deleteTarget._id || deleteTarget.id);
      }
      commitMembers(members.filter((member) => member.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMenuOpenId("");
      showToast("Family member deleted successfully.");
    } catch {
      showToast("Could not delete family member.");
    }
  };

  const logout = () => {
    clearAuthSession();
    showToast("Logged out successfully");
    window.setTimeout(() => navigate("/"), 700);
  };

  return (
    <AccountLayout
      active="family"
      breadcrumbCurrent="Family Members"
      title="Family Members"
      subtitle="Manage your family members for easy booking and better experience."
      actions={
        <>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-6 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
          <button
            type="button"
            onClick={() => setMemberModal({})}
            className="inline-flex h-12 items-center gap-3 rounded-lg bg-upchar-blue px-6 text-sm font-black text-white shadow-lg shadow-blue-900/15 transition hover:bg-navy-800"
          >
            <Plus className="h-5 w-5" />
            Add Family Member
          </button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Members" value={summary.total} icon="UsersRound" color="blue" />
        <SummaryCard title="Male Members" value={summary.male} icon="UserRound" color="green" />
        <SummaryCard title="Female Members" value={summary.female} icon="UsersRound" color="purple" />
        <SummaryCard title="Blood Groups" value={summary.bloodGroups} icon="Droplet" color="red" />
      </section>

      {error ? <p className="rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-navy-800">{error}</p> : null}

      {loading ? (
        <section className="rounded-lg border border-blue-100 bg-white p-8 text-center text-sm font-black text-navy-700 shadow-sm">
          Loading family members...
        </section>
      ) : members.length ? (
        <section className="grid gap-5">
          {members.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              menuOpen={menuOpenId === member.id}
              onToggleMenu={(id) => setMenuOpenId((current) => (current === id ? "" : id))}
              onEdit={(selectedMember) => setMemberModal(selectedMember)}
              onDelete={(selectedMember) => setDeleteTarget(selectedMember)}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-navy-900">No family members added</h2>
          <p className="mt-2 text-sm font-semibold text-navy-700">Add a family member to book tests faster.</p>
        </section>
      )}

      <AddNewCard
        title="Add New Family Member"
        text={"Add your family member details\nfor easy booking and management."}
        onClick={() => setMemberModal({})}
      />

      <section className="grid gap-4 rounded-lg border border-green-100 bg-green-50/50 p-6 shadow-sm sm:grid-cols-[64px_1fr]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-black text-upchar-green">Why add family members?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            Adding family members helps you book tests quickly, view reports separately and manage everyone's health in one place.
          </p>
        </div>
      </section>

      <TrustStrip />

      {memberModal ? (
        <FamilyMemberFormModal
          member={memberModal.id ? memberModal : null}
          onClose={() => setMemberModal(null)}
          onSave={saveMember}
        />
      ) : null}
      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Family Member"
          message={`Are you sure you want to delete ${deleteTarget.fullName || deleteTarget.name}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteMember}
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

export default AccountFamilyMembersPage;
