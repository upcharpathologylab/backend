const firstText = (...values) => {
  const match = values.find((value) => typeof value === "string" && value.trim());
  return match?.trim() || "";
};

const phoneLink = (value) => {
  const normalized = String(value || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
};

const whatsappLink = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

export function resolveContactInfo(content, defaults = {}, serviceLocation = null) {
  const settings = content?.settings || {};
  const phoneNumber = firstText(settings.phoneNumber, defaults.phone);
  const whatsappNumber = firstText(settings.whatsappNumber, defaults.whatsappNumber);
  const emailAddress = firstText(settings.emailAddress, defaults.email);

  return {
    heading: firstText(content?.title, defaults.contactHeading),
    phoneNumber,
    phoneTiming: firstText(settings.phoneTiming, defaults.phoneTiming, defaults.hours),
    whatsappNumber,
    whatsappText: firstText(settings.whatsappText, defaults.whatsappText),
    emailAddress,
    emailResponseText: firstText(settings.emailResponseText, defaults.emailResponseText),
    companyName: firstText(settings.companyName, serviceLocation?.centerName, defaults.companyName),
    address: firstText(settings.address, serviceLocation?.fullAddress, defaults.address),
    phoneHref: phoneLink(phoneNumber),
    whatsappHref: whatsappLink(whatsappNumber),
    emailHref: emailAddress ? `mailto:${emailAddress}` : ""
  };
}
