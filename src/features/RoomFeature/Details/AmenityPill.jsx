import React from "react";
import { AMENITY_ICONS } from "../../../utils/amenities";

export default function AmenityPill({ label }) {
  const icon = AMENITY_ICONS[label] || "•";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
