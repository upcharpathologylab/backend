import { Headphones, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { resolveContactInfo } from "../../utils/contactInfo.js";

function ContactInfo({ content, immediateHelp, serviceLocation, defaults }) {
  const contact = resolveContactInfo(content, defaults, serviceLocation);
  const contacts = [
    {
      title: "Call Us",
      value: contact.phoneNumber,
      note: contact.phoneTiming,
      href: contact.phoneHref,
      icon: Phone,
      tone: "bg-blue-50 text-upchar-blue"
    },
    {
      title: "WhatsApp",
      value: contact.whatsappNumber,
      note: contact.whatsappText,
      href: contact.whatsappHref,
      icon: MessageCircle,
      tone: "bg-green-50 text-upchar-green"
    },
    {
      title: "Email Us",
      value: contact.emailAddress,
      note: contact.emailResponseText,
      href: contact.emailHref,
      icon: Mail,
      tone: "bg-blue-50 text-upchar-blue"
    },
    {
      title: "Visit Us",
      value: contact.companyName,
      note: contact.address,
      icon: MapPin,
      tone: "bg-violet-50 text-upchar-purple"
    }
  ].filter((item) => item.value || item.note);

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm lg:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
            <UserRound className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-black text-upchar-blue">{contact.heading}</h2>
        </div>

        <div className="mt-7 grid gap-6">
          {contacts.map((item) => {
            const Icon = item.icon;
            return (
              <article className="grid grid-cols-[56px_1fr] gap-4" key={item.title}>
                <span className={`flex h-14 w-14 items-center justify-center rounded-full ${item.tone}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-upchar-blue">{item.title}</h3>
                  {item.href ? (
                    <a className="mt-1 block text-base font-black text-navy-900" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base font-black text-navy-900">{item.value}</p>
                  )}
                  <p className="mt-1 text-sm font-semibold leading-6 text-navy-700">{item.note}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-blue-100 bg-white p-6 shadow-sm sm:grid-cols-[70px_1fr]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-upchar-green">
          <Headphones className="h-9 w-9" />
        </span>
        <div>
          <h2 className="text-lg font-black text-upchar-blue">{immediateHelp?.title || ""}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">{immediateHelp?.description || ""}</p>
          <a
            href={contact.whatsappHref || "#"}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-upchar-green px-5 py-2 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            <MessageCircle className="h-4 w-4" />
            {immediateHelp?.settings?.buttonText || ""}
          </a>
        </div>
      </section>
    </div>
  );
}

export default ContactInfo;
