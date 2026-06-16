function TabFilterBar({ tabs, activeTab, onTabChange, rightControl }) {
  return (
    <div className="flex flex-col gap-4 border-b border-blue-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              type="button"
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-black transition ${
                active
                  ? "border-upchar-green text-upchar-green"
                  : "border-transparent text-navy-700 hover:text-upchar-blue"
              }`}
              key={tab}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {rightControl ? <div className="shrink-0">{rightControl}</div> : null}
    </div>
  );
}

export default TabFilterBar;
