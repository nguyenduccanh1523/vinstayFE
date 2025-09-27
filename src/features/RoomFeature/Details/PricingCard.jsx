import React, { useMemo, useState } from "react";
import { diffNights } from "../../../utils/amenities";

const TAX_RATE = 0.10; // 10%

export default function PricingCard({ basePrice, defaultCheckIn, defaultCheckOut, defaultGuests = 2, onReserve }) {
  const [checkIn, setCheckIn] = useState(defaultCheckIn || "");
  const [checkOut, setCheckOut] = useState(defaultCheckOut || "");
  const [guests, setGuests] = useState(defaultGuests);

  const { nights, subtotal, taxes, total } = useMemo(() => {
    const n = diffNights(checkIn, checkOut);
    const sub = Math.max(0, (Number(basePrice) || 0) * n);
    const tax = Math.round(sub * TAX_RATE);
    const tot = sub + tax;
    return { nights: n, subtotal: sub, taxes: tax, total: tot };
  }, [checkIn, checkOut, basePrice]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-slate-900">${basePrice}</div>
        <div className="text-slate-600">per night</div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
          <input
            type="date"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Check-out</label>
          <input
            type="date"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Guests</label>
          <select
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3 mb-6 py-4 border-t border-b border-slate-200">
        <div className="flex justify-between text-sm">
          <span>${basePrice} x {nights} night{nights>1?"s":""}</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Taxes and fees</span>
          <span>${taxes}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <button
        className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 mb-4"
        onClick={() => onReserve?.({ checkIn, checkOut, guests, nights, subtotal, taxes, total })}
      >
        Reserve Now
      </button>

      <div className="text-center text-sm text-slate-600">You won't be charged yet</div>
    </div>
  );
}
