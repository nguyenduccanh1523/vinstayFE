import React from "react";

export default function HotelsHeader({ filters, onChange, onToggleFilters }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Find Your Perfect Hotel
        </h1>

        <div className="grid gap-4 md:grid-cols-6 bg-slate-50 p-4 rounded-2xl">
          <input
            type="text"
            placeholder="Where are you going?"
            className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
          />
          <input
            type="date"
            className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={filters.checkIn}
            onChange={(e) => onChange({ ...filters, checkIn: e.target.value })}
          />
          <input
            type="date"
            className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={filters.checkOut}
            onChange={(e) => onChange({ ...filters, checkOut: e.target.value })}
          />
          <select
            className="h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={filters.guests}
            onChange={(e) => onChange({ ...filters, guests: e.target.value })}
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>

          <button className="h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 col-span-2 md:col-span-1">
            Search
          </button>

          <button
            onClick={onToggleFilters}
            className="h-12 rounded-xl border border-slate-300 bg-white font-medium hover:bg-slate-50 md:hidden"
          >
            Filters
          </button>
        </div>
      </div>
    </div>
  );
}
