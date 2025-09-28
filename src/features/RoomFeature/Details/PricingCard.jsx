import React, { useMemo, useState } from "react";
import { diffNights } from "../../../utils/amenities";
import { toast } from "react-toastify";

const TAX_RATE = 0.1; // 10%

export default function PricingCard({
  basePrice,
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests = 2,
  onReserve,
}) {
  const [checkIn, setCheckIn] = useState(defaultCheckIn || "");
  const [checkOut, setCheckOut] = useState(defaultCheckOut || "");
  const [guests, setGuests] = useState(defaultGuests);

  const { nights, subtotal, taxes, total, isValidDates, dateError } =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      let error = "";
      let isValid = true;

      if (!checkIn || !checkOut) {
        error = "Please select both check-in and check-out dates";
        isValid = false;
      } else if (checkInDate < today) {
        error = "Check-in date cannot be in the past";
        isValid = false;
      } else if (checkOutDate <= checkInDate) {
        error = "Check-out date must be after check-in date";
        isValid = false;
      }

      const n = isValid ? diffNights(checkIn, checkOut) : 0;
      const sub = Math.max(0, (Number(basePrice) || 0) * n);
      const tax = Math.round(sub * TAX_RATE);
      const tot = sub + tax;

      return {
        nights: n,
        subtotal: sub,
        taxes: tax,
        total: tot,
        isValidDates: isValid,
        dateError: error,
      };
    }, [checkIn, checkOut, basePrice]);

  const handleReserve = () => {
    if (!isValidDates) {
      toast.error(dateError, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    onReserve?.({ checkIn, checkOut, guests, nights, subtotal, taxes, total });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];
  // Get tomorrow's date for min checkout
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-slate-900">${basePrice}</div>
        <div className="text-slate-600">per night</div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            className={`w-full h-12 rounded-xl border px-4 focus:outline-none focus:ring-2 ${
              !isValidDates && checkIn
                ? "border-red-300 focus:ring-red-500/60"
                : "border-slate-300 focus:ring-slate-900/60"
            }`}
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            className={`w-full h-12 rounded-xl border px-4 focus:outline-none focus:ring-2 ${
              !isValidDates && checkOut
                ? "border-red-300 focus:ring-red-500/60"
                : "border-slate-300 focus:ring-slate-900/60"
            }`}
            value={checkOut}
            min={checkIn || tomorrowStr}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Guests
          </label>
          <select
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isValidDates && (checkIn || checkOut) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ {dateError}</p>
        </div>
      )}

      <div className="space-y-3 mb-6 py-4 border-t border-b border-slate-200">
        <div className="flex justify-between text-sm">
          <span>
            ${basePrice} x {nights} night{nights > 1 ? "s" : ""}
          </span>
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
        className={`w-full h-12 rounded-xl font-medium mb-4 transition-colors ${
          isValidDates
            ? "bg-slate-900 text-white hover:bg-slate-800"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
        }`}
        onClick={handleReserve}
        disabled={!isValidDates}
      >
        Reserve Now
      </button>

      <div className="text-center text-sm text-slate-600">
        You won't be charged yet
      </div>
    </div>
  );
}
