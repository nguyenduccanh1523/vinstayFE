import React from "react";
import { Link } from "react-router-dom";
import { normalizeAmenities } from "../../../utils/amenities";
import { mapApiRoomToCard } from "./roomsMap";

function RoomCardInline({ room, search }) {
  const mapped = mapApiRoomToCard(room); // chuẩn hoá giống RoomCard.jsx
  const img = mapped.image || "https://via.placeholder.com/400x240?text=Room";
  const amen = normalizeAmenities(mapped.amenities);
  const state = { room: mapped, ...search };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <img src={img} alt={mapped.name} className="h-24 w-32 rounded-xl object-cover" loading="lazy" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">{mapped.name}</h4>
              {mapped.description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{mapped.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span>🛏️ {mapped.bedType}</span>
                <span>👥 {mapped.maxGuests} guests</span>
                <span>🪟 {mapped.view}</span>
                <span>📐 {mapped.size} m²</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">${mapped.price}</div>
              <div className="text-sm text-slate-600">/night</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-1">
              {amen.slice(0, 4).map((a) => (
                <span key={a.key} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                  {a.label}
                </span>
              ))}
              {amen.length > 4 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                  +{amen.length - 4} more
                </span>
              )}
            </div>

            <Link
              to={`/room-detail/${mapped.id}`}
              state={state}
              className="h-10 px-6 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
            >
              Select Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomsList({ rooms, search }) {
  const availableRooms = (rooms || []).filter((r) => r.is_available);

  if (!availableRooms.length) {
    return <div className="text-slate-600">No available rooms at the moment.</div>;
  }

  return (
    <div className="space-y-4">
      {availableRooms.map((r) => (
        <RoomCardInline key={r._id} room={r} search={search} />
      ))}
    </div>
  );
}
