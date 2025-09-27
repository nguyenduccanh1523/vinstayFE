import React from "react";
import { normalizeAmenities } from "../../../utils/amenities";

export default function AmenitiesGrid({ items }) {
  const list = normalizeAmenities(items);
  if (!list.length) return <div className="text-slate-600">No amenities listed.</div>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((a) => (
        <div key={a.key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
          <span className="text-xl">{a.icon}</span>
          <span className="text-sm font-medium">{a.label}</span>
        </div>
      ))}
    </div>
  );
}
