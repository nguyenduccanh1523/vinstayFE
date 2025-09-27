import React, { useState } from "react";

export default function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 pb-4 mb-4">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-between w-full text-left font-medium text-slate-900 mb-3"
      >
        {title}
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}
