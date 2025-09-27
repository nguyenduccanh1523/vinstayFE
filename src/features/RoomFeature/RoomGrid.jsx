// components/rooms/RoomGrid.jsx
import React from "react";
import RoomCard from "./RoomCard";

export default function RoomGrid({ rooms, search }) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} search={search} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="h-12 px-8 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium">
          Load More Rooms
        </button>
      </div>
    </>
  );
}
