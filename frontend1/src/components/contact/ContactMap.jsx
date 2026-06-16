import { Accessibility, Car, MapPinned, Train, Utensils } from "lucide-react";

const visitIcons = [Car, Accessibility, Train, Utensils];

function ContactMap({ content, serviceLocation }) {
  const savedEmbedUrl = serviceLocation?.googleMapEmbedUrl?.trim() || "";
  const hasCoordinates = serviceLocation?.latitude != null && serviceLocation?.longitude != null;
  const mapEmbedUrl =
    savedEmbedUrl.includes("output=embed") || savedEmbedUrl.includes("/embed")
      ? savedEmbedUrl
      : hasCoordinates
        ? `https://maps.google.com/maps?q=${serviceLocation.latitude},${serviceLocation.longitude}&z=15&output=embed`
        : "";
  const locationQuery = `${serviceLocation?.centerName || ""} ${serviceLocation?.fullAddress || ""}`.trim();
  const mapsUrl =
    serviceLocation?.googlePlaceUrl?.trim() ||
    serviceLocation?.googleDirectionUrl?.trim() ||
    (hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${serviceLocation.latitude},${serviceLocation.longitude}`
      : locationQuery
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
        : "");
  const visitItems = String(content?.settings?.featurePoints || "")
    .split("\n")
    .map((label) => label.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="relative h-[230px]">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title={serviceLocation?.centerName || "Service location map"}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              aria-label="Open location in Google Maps"
            />
          ) : null}
          <div className="absolute bottom-4 right-4 grid overflow-hidden rounded-md border border-blue-100 bg-white shadow-sm">
            <button type="button" className="flex h-9 w-9 items-center justify-center border-b border-blue-100 text-xl font-black text-navy-900">
              +
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center text-xl font-black text-navy-900">
              -
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm lg:p-7">
        <h2 className="text-2xl font-black text-upchar-blue">{content?.title || ""}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-navy-700">{content?.description || ""}</p>
        <ul className="mt-6 grid gap-4">
          {visitItems.map((item, index) => {
            const Icon = visitIcons[index % visitIcons.length];
            return (
              <li className="flex items-center gap-4 text-sm font-bold text-navy-800" key={item}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
                  <Icon className="h-4 w-4" />
                </span>
                {item}
              </li>
            );
          })}
        </ul>
        <a
          href={mapsUrl || "#"}
          target={mapsUrl ? "_blank" : undefined}
          rel={mapsUrl ? "noopener noreferrer" : undefined}
          className="mt-6 inline-flex items-center gap-2 text-sm font-black text-upchar-blue"
        >
          <MapPinned className="h-5 w-5" />
          Directions
        </a>
      </section>
    </div>
  );
}

export default ContactMap;
