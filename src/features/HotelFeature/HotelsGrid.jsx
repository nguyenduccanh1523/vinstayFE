import React from "react";
import HotelCard from "./HotelCard";

export default function HotelsGrid({ hotels, loading }) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-600">
          {loading ? "Loading…" : `${hotels.length} hotels found`}
        </p>
        <select className="h-10 rounded-xl border border-slate-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
          <option>Sort by: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {!loading && hotels.map((h) => <HotelCard key={h.id} hotel={h} />)}
        {loading && (
          <div className="text-slate-500">Fetching hotels…</div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center mt-12">
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50">
            Previous
          </button>
          <button className="h-10 px-4 rounded-xl bg-slate-900 text-white">
            1
          </button>
          <button className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50">
            2
          </button>
          <button className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
