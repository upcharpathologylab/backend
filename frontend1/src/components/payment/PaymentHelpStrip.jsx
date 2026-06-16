import { Headphones, Mail, MessageCircle } from "lucide-react";

function PaymentHelpStrip() {
  const items = [
    {
      icon: Headphones,
      title: "Need help with your payment?",
      lines: ["Call us at 7838532205", "Mon - Sun: 7:00 AM - 9:00 PM"]
    },
    {
      icon: MessageCircle,
      title: "Chat with us on WhatsApp",
      lines: ["Get instant support"]
    },
    {
      icon: Mail,
      title: "Write to us",
      lines: ["support@upcharlab.com", "We reply within a few minutes"]
    }
  ];

  return (
    <section className="mt-8 grid gap-0 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm lg:grid-cols-3">
      {items.map((item) => {
        const ItemIcon = item.icon;

        return (
          <div className="grid gap-4 border-blue-100 p-6 md:grid-cols-[54px_1fr] md:items-center lg:border-r lg:last:border-r-0" key={item.title}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
              <ItemIcon className="h-7 w-7" />
            </span>
            <div>
              <h3 className="text-base font-black text-navy-900">{item.title}</h3>
              {item.lines.map((line) => (
                <p className="mt-1 text-sm font-semibold text-navy-700" key={line}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default PaymentHelpStrip;
