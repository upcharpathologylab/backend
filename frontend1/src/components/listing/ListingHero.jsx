import { Search } from "lucide-react";
import { assetUrl } from "../../api/api.js";
import Icon from "../Icon.jsx";

const tone = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  teal: "bg-teal-50 text-upchar-teal"
};

function ListingHero({ hero, searchTerm, onSearchChange, onQuickCategory }) {
  return (
    <section className="overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50/60">
      <div className="container-page py-8 lg:py-10">
        <div className="relative overflow-hidden rounded-none bg-white/70 lg:min-h-[245px]">
          <div className="relative z-10 grid min-w-0 items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="w-full min-w-0 max-w-2xl py-2">
              <p className="text-xs font-black text-navy-700">{hero.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-navy-900 sm:text-4xl lg:text-5xl">{hero.title}</h1>
              <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-navy-700">{hero.subtitle}</p>

              <form
                className="mt-6 flex h-[50px] w-full max-w-full overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="flex min-w-0 flex-1 items-center gap-3 px-5 text-navy-500">
                  <Search className="h-5 w-5 shrink-0" />
                  <input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={hero.searchPlaceholder}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-500"
                  />
                </label>
                <button type="submit" className="w-16 shrink-0 bg-upchar-green text-white transition hover:bg-upchar-greenDark" aria-label="Search">
                  <Search className="mx-auto h-6 w-6" />
                </button>
              </form>

              {hero.quickCategories ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                  {hero.quickCategories.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => onQuickCategory?.(item.value)}
                    className="min-w-0 rounded-lg border border-blue-100 bg-white px-3 py-3 text-center text-xs font-black text-navy-800 shadow-sm transition hover:-translate-y-0.5 hover:border-upchar-green"
                    >
                      <Icon name={item.icon} className={`mx-auto mb-2 h-6 w-6 ${tone[item.color] || tone.blue}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative hidden min-h-[220px] overflow-hidden rounded-xl lg:block">
              <img src={assetUrl(hero.image)} alt={hero.imageAlt} className="absolute inset-0 h-full w-full object-cover object-right" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/25 to-transparent" />
            </div>
          </div>

          {hero.badgeItems ? (
            <div className="relative z-10 mt-6 grid gap-3 rounded-lg border border-blue-100 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
              {hero.badgeItems.map((item) => (
                <div className="flex items-center gap-3 rounded-md px-2 py-2" key={item.title}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-upchar-green">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-black leading-5 text-navy-800">{item.title}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ListingHero;
