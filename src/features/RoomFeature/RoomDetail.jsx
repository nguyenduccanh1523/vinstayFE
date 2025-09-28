import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "../../features/RoomFeature/Details/ImageGallery";
import AmenityPill from "../../features/RoomFeature/Details/AmenityPill";
import PricingCard from "../../features/RoomFeature/Details/PricingCard";
import { roomApi } from "../../apis/roomApi";
import { normalizeAmenity } from "../../utils/amenities";

const DEFAULT_SIZE = 32;
const DEFAULT_VIEW = "City View";

function mapApiToVM(r) {
  const hotel = typeof r.hotel_id === "object" ? r.hotel_id?.name : "";
  const city = typeof r.hotel_id === "object" ? r.hotel_id?.city : "";
  return {
    id: r._id,
    name: `${r.room_type || "Room"} ${
      r.room_number ? `#${r.room_number}` : ""
    }`,
    hotel,
    hotelLocation: city,
    price: r.price ?? 0,
    images: r.images || [],
    description: r.description || "",
    bedType: r.room_type || "Bed",
    maxGuests: r.capacity || 2,
    size: DEFAULT_SIZE,
    view: DEFAULT_VIEW,
    amenities: (r.amenities || []).map(normalizeAmenity),
    features: [],
    rating: 4.8, // tạm
    reviewCount: 120, // tạm
    policies: {
      checkIn: r.check_in || "3:00 PM",
      checkOut: r.check_out || "12:00 PM",
      cancellation: "Free cancellation until 24 hours before check-in",
      pets: "Pets not allowed",
      smoking: "Non-smoking room",
      children: "Children of all ages welcome",
    },
  };
}

export default function RoomDetail() {
  const { id } = useParams();
  const { state } = useLocation(); // { room, checkIn, checkOut, guests }
  const [room, setRoom] = useState(() => state?.room || null);
  const [loading, setLoading] = useState(!state?.room);
  const navigate = useNavigate();

  useEffect(() => {
    if (room || !id) return;
    (async () => {
      setLoading(true);
      try {
        const r = await roomApi.getRoomById(id);
        setRoom(mapApiToVM(r));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, room]);

  const vm = useMemo(() => {
    if (!room && state?.room) return mapApiToVM(state.roomRaw || state.room); // fallback
    return room ? room : null;
  }, [room, state]);

  if (loading || !vm) return <div className="p-6">Loading…</div>;


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <span>›</span>
            <Link to="/hotels" className="hover:text-slate-900">
              Hotels
            </Link>
            <span>›</span>
            <span className="text-slate-900">{vm.hotel_name || "Hotel"}</span>
            <span>›</span>
            <span className="text-slate-900">{vm.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {vm.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-600">
                      📍 {vm.hotel_name}
                      {vm.hotel_city ? `, ${vm.hotel_city}` : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-medium">{vm.rating}</span>
                      <span className="text-slate-600">
                        ({vm.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">
                  ♥ Save
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">🛏️</div>
                  <div className="text-sm text-slate-600">{vm.bedType}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-sm text-slate-600">
                    {vm.maxGuests} guests
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="text-sm text-slate-600">{vm.size} m²</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">🪟</div>
                  <div className="text-sm text-slate-600">{vm.view}</div>
                </div>
              </div>

              <ImageGallery images={vm.image} />
            </div>

            {/* Tabs (simple) */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About this room</h3>
              {vm.description && (
                <p className="text-slate-700 leading-relaxed mb-6">
                  {vm.description}
                </p>
              )}

              {!!vm.amenities?.length && (
                <>
                  <h4 className="text-lg font-semibold mb-3">Amenities</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {vm.amenities.map((a, i) => (
                      <AmenityPill key={`${a}-${i}`} label={a} />
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Policies</h4>
                  <p className="text-sm text-slate-600">
                    Check-in: {vm.check_in}
                  </p>
                  <p className="text-sm text-slate-600">
                    Check-out: {vm.check_out}
                  </p>
                  <p className="text-sm text-slate-600">
                    Free cancellation until 24 hours before check-in
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">House Rules</h4>
                  <p className="text-sm text-slate-600">Pets not allowed</p>
                  <p className="text-sm text-slate-600">Non-smoking room</p>
                  <p className="text-sm text-slate-600">
                    Children of all ages welcome
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingCard
                basePrice={vm.price}
                defaultCheckIn={state?.checkIn}
                defaultCheckOut={state?.checkOut}
                defaultGuests={state?.guests || 2}
                onReserve={(payload) => {
                  const bookingData = {
                    roomId: vm.id,
                    hotelId: vm.hotel_id || vm.hotel?.id,
                    roomName: vm.name,
                    hotelName: vm.hotel || vm.hotel_name,
                    hotelLocation: vm.hotelLocation || vm.hotel_city,
                    ...payload,
                  };
                  navigate("/checkout", { state: { bookingData } });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
