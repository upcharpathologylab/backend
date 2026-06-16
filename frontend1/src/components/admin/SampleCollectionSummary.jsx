function SampleCollectionSummary({ items }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-navy-950">Sample Collection Summary</h2>
        <a href="#" className="text-sm font-black text-upchar-blue">View All</a>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {safeItems.map((item) => {
          const positive = item.trend !== "down";
          return (
            <div className="rounded-lg border border-blue-100 p-4" key={item.title}>
              <p className="text-xs font-black text-navy-600">{item.title}</p>
              <p className="mt-3 text-2xl font-black text-navy-950">{item.value}</p>
              <p className={`mt-2 text-sm font-black ${positive ? "text-upchar-green" : "text-upchar-red"}`}>
                {positive ? "Up" : "Down"} {item.change}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SampleCollectionSummary;
