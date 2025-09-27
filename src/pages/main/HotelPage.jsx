import React, { useEffect, useMemo, useState } from "react";
import { hotelApi } from "../../apis/hotelApi";
import HotelsHeader from "../../features/HotelFeature/HotelsHeader";
import FiltersSidebar from "../../features/HotelFeature/FiltersSidebar";
import HotelsGrid from "../../features/HotelFeature/HotelsGrid";

export default function HotelsPage() {
  const [loading, setLoading] = useState(false);
  const [allHotels, setAllHotels] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    priceRange: [0, 1000],
    rating: 0,          // số sao tối thiểu
    amenities: [],      // mảng string
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await hotelApi.getAllHotels();
        // Chỉ lấy active + chuẩn hoá dữ liệu ảnh & tiện ích
        const active = (data || []).filter(h => h?.status === "active");
        setAllHotels(
          active.map(h => ({
            id: h._id,
            name: h.name,
            location: `${h.city || ""}${h.city ? ", " : ""}${h.country || ""}`.trim(),
            price: h.avg_price ?? undefined, // nếu bạn có avg_price thì show, còn không thì ẩn
            rating: Number(h.rating || 0),
            discount: h.discount ?? undefined, // nếu backend bổ sung
            image: Array.isArray(h.images) && h.images.length ? h.images[0] : "",
            description: h.description || "",
            amenities: Array.isArray(h.amenities) ? h.amenities : [],
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return allHotels.filter(h => {
      // location (lọc theo city/country chứa chuỗi)
      const byLocation = filters.location
        ? (h.location || "").toLowerCase().includes(filters.location.toLowerCase())
        : true;

      // rating tối thiểu
      const byRating = filters.rating ? (h.rating || 0) >= filters.rating : true;

      // price range (nếu có price; nếu không có giá, cho qua)
      const byPrice = h.price == null
        ? true
        : h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1];

      // amenities (tất cả tiện ích chọn phải có trong hotel)
      const byAmenities = filters.amenities.length
        ? filters.amenities.every(a => (h.amenities || []).map(x => String(x).toLowerCase().trim()).includes(String(a).toLowerCase().trim()))
        : true;

      return byLocation && byRating && byPrice && byAmenities;
    });
  }, [allHotels, filters]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header search row */}
      <HotelsHeader
        filters={filters}
        onChange={setFilters}
        onToggleFilters={() => setShowMobileFilters(s => !s)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            openOnMobile={showMobileFilters}
          />

          {/* Grid */}
          <div className="flex-1">
            <HotelsGrid hotels={filtered} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
