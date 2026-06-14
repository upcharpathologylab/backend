import {
  defaultAddresses,
  defaultFamilyMembers,
  defaultProfile,
  profileStorageKey
} from "../data/profileData.js";

export const safeParseAccountData = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(profileStorageKey);
    }
    return null;
  }
};

const getId = (item) => item.id || item._id;

export const normalizeAddress = (address = {}) => {
  const id = String(getId(address) || `address-${Date.now()}`);
  const type = address.type || address.label || "Other";
  const isPrimary = Boolean(address.isPrimary ?? address.primary);
  const addressLine1 = address.addressLine1 || address.addressLine || "";
  const addressLine2 = address.addressLine2 || address.landmark || "";

  return {
    ...address,
    id,
    _id: address._id || id,
    type,
    label: address.label || type,
    name: address.name || (type === "Office" ? "Upchar Pathology Pvt. Ltd." : ""),
    addressLine1,
    addressLine2,
    addressLine: address.addressLine || [addressLine1, addressLine2].filter(Boolean).join(", "),
    landmark: address.landmark || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
    phone: address.phone || "",
    isPrimary,
    primary: isPrimary
  };
};

export const normalizeFamilyMember = (member = {}) => {
  const id = String(getId(member) || `family-${Date.now()}`);
  const fullName = member.fullName || member.name || "";

  return {
    ...member,
    id,
    _id: member._id || id,
    fullName,
    name: fullName,
    relation: member.relation || "",
    dateOfBirth: member.dateOfBirth || "",
    gender: member.gender || "",
    bloodGroup: member.bloodGroup || "",
    color: member.color || "green"
  };
};

export const loadAccountData = () => {
  if (typeof window === "undefined") {
    return {
      profile: defaultProfile,
      addresses: defaultAddresses.map(normalizeAddress),
      familyMembers: defaultFamilyMembers.map(normalizeFamilyMember)
    };
  }

  const stored = safeParseAccountData(window.localStorage.getItem(profileStorageKey));
  const isAuthenticated = Boolean(window.localStorage.getItem("upchar_token"));

  if (isAuthenticated) {
    return {
      profile: stored?.profile || {},
      addresses: (stored?.addresses || []).map(normalizeAddress),
      familyMembers: (stored?.familyMembers || []).map(normalizeFamilyMember)
    };
  }

  return {
    profile: { ...defaultProfile, ...(stored?.profile || {}) },
    addresses: (stored?.addresses?.length ? stored.addresses : defaultAddresses).map(normalizeAddress),
    familyMembers: (stored?.familyMembers?.length ? stored.familyMembers : defaultFamilyMembers).map(normalizeFamilyMember)
  };
};

export const saveAccountData = ({ profile, addresses, familyMembers }) => {
  if (typeof window === "undefined") return;

  const current = loadAccountData();
  window.localStorage.setItem(
    profileStorageKey,
    JSON.stringify({
      profile: profile || current.profile,
      addresses: (addresses || current.addresses).map(normalizeAddress),
      familyMembers: (familyMembers || current.familyMembers).map(normalizeFamilyMember)
    })
  );
};

export const makeLocalId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
