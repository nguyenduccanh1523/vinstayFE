import React, { useEffect, useMemo, useState } from "react";
import { roomApi } from "../../apis/roomApi";
import SearchHeader from "../../features/RoomFeature/SearchHeader";
import FiltersSidebar from "../../features/RoomFeature/FiltersSidebar";
import RoomGrid from "../../features/RoomFeature/RoomGrid";
import { normalizeAmenity } from "../../utils/amenities";

const DEFAULT_SIZE = 32; // m²
const DEFAULT_VIEW = "City View";
const DEFAULT_DISCOUNT = 12; // %

const mapApiRoomToCard = (r) => {
  const hotelName = typeof r.hotel_id === "object" ? r.hotel_id?.name : "";
  const city = typeof r.hotel_id === "object" ? r.hotel_id?.city : "";
  return {
    id: r._id,
    name: `${r.room_type || "Room"} ${
      r.room_number ? `#${r.room_number}` : ""
    } ${hotelName ? `- ${hotelName}` : ""}`,
    price: r.price ?? 0,
    discount: DEFAULT_DISCOUNT,
    image: r.images?.[0] || "",
    description: r.description || `${hotelName}${city ? ` • ${city}` : ""}`,
    bedType: r.room_type || "Bed",
    maxGuests: r.capacity || 2,
    size: r.room_area || DEFAULT_SIZE,
    view: r.view || DEFAULT_VIEW,
    amenities: (r.amenities || []).map(normalizeAmenity),
    is_available: !!r.is_available,
    check_in: r.check_in || "3:00 PM",
    check_out: r.check_out || "12:00 PM",
    hotel_name: r.hotel_id?.name || "",
    hotel_city: r.hotel_id?.city || "",
  };
};

export default function RoomPage() {
  const [filters, setFilters] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    priceRange: [0, 500],
    bedType: "",
    roomType: "",
    amenities: [],
    view: "",
  });
  const [openFilters, setOpenFilters] = useState({
    price: true,
    bedType: true,
    roomType: true,
    amenities: true,
    view: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [allRooms, setAllRooms] = useState([]);

  const toggleFilter = (name) =>
    setOpenFilters((p) => ({ ...p, [name]: !p[name] }));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await roomApi.getAllRooms();
        const available = (data || []).filter((r) => r.is_available);
        setAllRooms(available.map(mapApiRoomToCard));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRooms = useMemo(() => {
    return allRooms.filter(
      (r) =>
        r.price >= filters.priceRange[0] &&
        r.price <= filters.priceRange[1] &&
        Number(filters.guests || 1) <= (r.maxGuests || 1)
    );
  }, [allRooms, filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchHeader
        filters={filters}
        setFilters={setFilters}
        toggleMobile={() => setShowMobileFilters((s) => !s)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            openFilters={openFilters}
            toggleFilter={toggleFilter}
            visible={showMobileFilters}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                {loading
                  ? "Loading…"
                  : `${filteredRooms.length} rooms available`}
              </p>
              <select className="h-10 rounded-xl border border-slate-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Size: Large to Small</option>
                <option>Most Popular</option>
              </select>
            </div>

            <RoomGrid
              rooms={filteredRooms}
              search={{
                checkIn: filters.checkIn,
                checkOut: filters.checkOut,
                guests: Number(filters.guests),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
