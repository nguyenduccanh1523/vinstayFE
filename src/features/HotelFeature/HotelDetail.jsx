import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hotelApi } from "../../apis/hotelApi";
import { roomApi } from "../../apis/roomApi";
import ImageGallery from "./Details/ImageGallery";
import HotelHeader from "./Details/HotelHeader";
import TabsNav from "./Details/TabsNav";
import AmenitiesGrid from "./Details/AmenitiesGrid";
import ReviewsBlock from "./Details/ReviewsBlock";

import RoomsList from "./Details/RoomsList";

export default function HotelDetail() {
  const { id } = useParams(); // /hotel-detail/:id
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        // Ưu tiên gọi getHotelById nếu có, fallback sang getAllHotels()
        let h = null;
        if (typeof hotelApi.getHotelById === "function") {
          h = await hotelApi.getHotelById(id);
        } else {
          const all = await hotelApi.getAllHotels();
          h = (all || []).find((x) => x._id === id) || null;
        }
        setHotel(h || null);

        if (h?._id) {
          const r = await roomApi.getRoomsByHotel(h._id);
          setRooms(Array.isArray(r) ? r : []);
        } else {
          setRooms([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const header = useMemo(() => {
    if (!hotel) return { name: "", location: "", rating: 0, reviewCount: 0 };
    const location = `${hotel.city || ""}${hotel.city ? ", " : ""}${
      hotel.country || ""
    }`.trim();
    return {
      name: hotel.name,
      location,
      rating: Number(hotel.rating || 0),
      reviewCount: 1247, // cố định như yêu cầu
    };
  }, [hotel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center p-8">
        <div className="text-slate-600">Loading hotel…</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center p-8">
        <div className="text-slate-600">Hotel not found.</div>
        <Link to="/hotels" className="mt-4 underline text-slate-900">
          Back to Hotels
        </Link>
      </div>
    );
  }

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
            <span className="text-slate-900">{hotel.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <HotelHeader {...header} />
            <ImageGallery images={hotel.images} />

            <TabsNav
              active={activeTab}
              onChange={setActiveTab}
              tabs={["overview", "rooms", "amenities", "reviews"]}
            />

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    About this hotel
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {hotel.description ||
                      "This hotel offers comfortable rooms with great service."}
                  </p>
                </div>
                {!!hotel.highlights?.length && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {hotel.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Available Rooms</h3>
                <RoomsList rooms={rooms} />
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Hotel Amenities</h3>
                <AmenitiesGrid items={hotel.amenities} />
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsBlock
                hotelId={hotel._id}
                rating={header.rating}
                reviewCount={header.reviewCount}
              />
            )}
          </div>

          {/* Sidebar: theo yêu cầu "xóa check giá ở hotel" -> không hiển thị price/tổng tiền ở đây */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold mb-3">Check Availability</h3>
              <form className="space-y-4">
                <div className="grid gap-3">
                  <input
                    type="date"
                    className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                  />
                  <input
                    type="date"
                    className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                  />
                  <select className="h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
                    <option>2 Guests</option>
                    <option>1 Guest</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
                  onClick={() => {
                    // gợi ý: scroll tới tab Rooms
                    setActiveTab("rooms");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  See Available Rooms
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-600">
                Free cancellation until 24 hours before check-in
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
