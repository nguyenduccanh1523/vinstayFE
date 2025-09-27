// components/rooms/RoomCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const fallbackImg =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop";

export default function RoomCard({ room, search }) {
  // search = {checkIn, checkOut, guests} từ header
  const state = { room, ...search };

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={room.image || fallbackImg}
          alt={room.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
          Available
        </div>
        {!!room.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            -{room.discount}%
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900">${room.price}</span>
            <p className="text-xs text-slate-500">/night</p>
          </div>
        </div>

        {room.description && (
          <p className="text-sm text-slate-600 mb-3">{room.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-slate-600">
          <div>🛏️ {room.bedType}</div>
          <div>👥 {room.maxGuests} guests</div>
          <div>📐 {room.size} m²</div>
          <div>🪟 {room.view}</div>
        </div>

        {!!room.amenities?.length && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 6).map((a, i) => (
              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Link
            to={`/room-detail/${room.id}`}
            state={state}
            className="flex-1 h-10 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
          >
            Book Now
          </Link>
          <Link
            to={`/room-detail/${room.id}`}
            state={state}
            className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 grid place-items-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
