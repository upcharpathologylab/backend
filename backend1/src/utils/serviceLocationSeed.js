import ServiceLocation from "../models/ServiceLocation.js";

export async function ensureServiceLocationSeedData() {
  if (await ServiceLocation.exists({})) return;

  await ServiceLocation.create({
    centerName: "Upchar Diagnostics Center",
    fullAddress: "163, Health Street, Sector 44, Noida, Uttar Pradesh - 201301",
    areaLabel: "Noida Sector 16",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    openingTime: "7:00 AM",
    closingTime: "9:00 PM",
    openStatusText: "Open today: 7:00 AM - 9:00 PM",
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  });
}
