import React from "react";

export default function TabsNav({ active, onChange, tabs }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`pb-4 text-sm font-medium capitalize border-b-2 transition-colors ${
              active === t
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>
    </div>
  );
}
