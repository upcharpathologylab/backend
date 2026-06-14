function AccountLoadingState({ label = "Loading account data..." }) {
  return (
    <section className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm" key={item}>
          <div className="h-5 w-1/3 animate-pulse rounded bg-blue-100" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-blue-50" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-blue-50" />
        </div>
      ))}
      <p className="sr-only">{label}</p>
    </section>
  );
}

function AccountEmptyState({ title, text }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-black text-navy-900">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-navy-700">{text}</p>
    </section>
  );
}

function AccountSyncNotice({ message }) {
  if (!message) return null;

  return (
    <p className="rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-navy-800">
      {message}
    </p>
  );
}

export { AccountEmptyState, AccountLoadingState, AccountSyncNotice };
