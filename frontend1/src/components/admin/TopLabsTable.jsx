function TopLabsTable({ labs }) {
  const safeLabs = Array.isArray(labs) ? labs : [];

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-navy-950">Top Performing Laboratories</h2>
        <a href="#" className="text-sm font-black text-upchar-blue">View All</a>
      </div>
      <div className="mt-6 max-w-full overflow-x-auto">
        <table className="w-full min-w-[520px] text-left">
          <thead className="text-sm font-black text-navy-600">
            <tr className="border-b border-blue-100">
              <th className="pb-4">Laboratory</th>
              <th className="pb-4">Tests</th>
              <th className="pb-4">Accuracy</th>
              <th className="pb-4">TAT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 text-sm font-semibold text-navy-800">
            {safeLabs.map((lab) => (
              <tr key={lab.name}>
                <td className="py-4 font-black text-navy-900">{lab.name}</td>
                <td className="py-4">{lab.tests}</td>
                <td className="py-4">{lab.accuracy}</td>
                <td className="py-4">{lab.tat}</td>
              </tr>
            ))}
            {!safeLabs.length ? (
              <tr>
                <td className="py-6 text-center text-sm font-black text-navy-500" colSpan={4}>
                  No laboratory performance data available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TopLabsTable;
