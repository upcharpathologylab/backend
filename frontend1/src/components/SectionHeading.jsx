function SectionHeading({ eyebrow, title, highlight, subtitle, centered = true, action }) {
  return (
    <div className={`mb-8 flex flex-col gap-3 ${centered ? "items-center text-center" : "items-start text-left"} lg:mb-10`}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.22em] text-upchar-green">{eyebrow}</p>}
      <div className="flex w-full items-start justify-between gap-4">
        <div className={centered ? "mx-auto" : ""}>
          <h2 className="text-3xl font-black leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
            {title} {highlight && <span className="text-upchar-green">{highlight}</span>}
          </h2>
          <div className={`mt-4 flex gap-2 ${centered ? "justify-center" : "justify-start"}`}>
            <span className="h-1 w-12 rounded-full bg-upchar-blue" />
            <span className="h-1 w-8 rounded-full bg-upchar-green" />
          </div>
        </div>
        {action && <div className="hidden shrink-0 pt-2 md:block">{action}</div>}
      </div>
      {subtitle && <p className="max-w-3xl text-base leading-7 text-navy-700 sm:text-lg">{subtitle}</p>}
      {action && <div className="md:hidden">{action}</div>}
    </div>
  );
}

export default SectionHeading;
