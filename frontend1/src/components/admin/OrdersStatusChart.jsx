function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function OrdersStatusChart({ items }) {
  const safeItems = Array.isArray(items) ? items : [];
  const total = safeItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
  let cursor = 0;
  const segments = safeItems
    .map((item) => {
      const percent = total ? (Number(item.value || 0) / total) * 100 : 0;
      const segment = `${item.color} ${cursor}% ${cursor + percent}%`;
      cursor += percent;
      return segment;
    })
    .filter((segment) => !segment.includes(" 0% 0%"));
  const chartBackground = total ? `conic-gradient(${segments.join(",")})` : "conic-gradient(#e5edf8 0% 100%)";

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-950">Orders by Status</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="relative mx-auto h-52 w-52 rounded-full" style={{ background: chartBackground }}>
          <div className="absolute inset-12 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <span className="text-2xl font-black text-navy-950">{formatNumber(total)}</span>
            <span className="text-sm font-black text-navy-600">Total</span>
          </div>
        </div>
        <div className="grid gap-5">
          {safeItems.map((item) => (
            <div className="flex items-start gap-3" key={item.label}>
              <span className="mt-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-sm font-black text-navy-900">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-navy-700">
                  {formatNumber(item.value)} ({item.percent})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrdersStatusChart;
