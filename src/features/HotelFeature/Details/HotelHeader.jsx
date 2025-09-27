import React from "react";

export default function HotelHeader({ name, location, rating, reviewCount }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium">{Number(rating || 0).toFixed(1)}</span>
            <span className="text-slate-600">({reviewCount} reviews)</span>
          </div>
          {location && <span className="text-slate-600">📍 {location}</span>}
        </div>
      </div>

      <button className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">
        ♥ Save
      </button>
    </div>
  );
}
