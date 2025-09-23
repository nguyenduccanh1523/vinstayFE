import React, { useState } from "react";

const HotelCard = ({ hotel }) => (
  <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="relative">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="h-56 w-full object-cover"
      />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium">
        ⭐ {hotel.rating}
      </div>
      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
        -{hotel.discount}%
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
        <span className="text-lg font-bold text-slate-900">
          ${hotel.price}/night
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-2">📍 {hotel.location}</p>
      <p className="text-sm text-slate-600 mb-3">{hotel.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {hotel.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
          >
            {amenity}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <a
          href={`/hotel-detail/${hotel.id}`}
          className="flex-1 h-10 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
        >
          View Details
        </a>
        <button className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50">
          ♥
        </button>
      </div>
    </div>
  </div>
);

const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="border-b border-slate-200 pb-4">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left font-medium text-slate-900 mb-3"
    >
      {title}
      <span
        className={`transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>
    {isOpen && <div className="space-y-2">{children}</div>}
  </div>
);

const HotelPage = () => {
  const [filters, setFilters] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
  });

  const [openFilters, setOpenFilters] = useState({
    price: true,
    rating: true,
    amenities: true,
    location: true,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleFilter = (filterName) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Sample hotel data
  const hotels = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Hà Nội, Hoàn Kiếm",
      price: 299,
      rating: 4.8,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
      description:
        "Luxury hotel in the heart of Old Quarter with stunning city views",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
    },
    {
      id: 2,
      name: "Saigon Star Hotel",
      location: "TP.HCM, Quận 1",
      price: 189,
      rating: 4.6,
      discount: 20,
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600&auto=format&fit=crop",
      description:
        "Modern hotel with rooftop bar and excellent business facilities",
      amenities: ["WiFi", "Bar", "Conference", "Parking"],
    },
    {
      id: 3,
      name: "Royal Beach Resort",
      location: "Đà Nẵng, Ngũ Hành Sơn",
      price: 359,
      rating: 4.9,
      discount: 10,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600&auto=format&fit=crop",
      description:
        "Beachfront resort with private beach access and water sports",
      amenities: ["Beach", "Pool", "Spa", "Water Sports", "Restaurant"],
    },
    {
      id: 4,
      name: "Mountain View Lodge",
      location: "Sapa, Lào Cai",
      price: 129,
      rating: 4.4,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",
      description: "Cozy lodge with panoramic mountain views and local cuisine",
      amenities: ["Mountain View", "Restaurant", "Hiking", "WiFi"],
    },
    {
      id: 5,
      name: "Heritage Boutique Hotel",
      location: "Hội An, Quảng Nam",
      price: 219,
      rating: 4.7,
      discount: 12,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop",
      description: "Traditional Vietnamese architecture meets modern luxury",
      amenities: ["Cultural Tours", "Spa", "Pool", "Restaurant", "Bike Rental"],
    },
    {
      id: 6,
      name: "Urban Business Hotel",
      location: "Hà Nội, Cầu Giấy",
      price: 149,
      rating: 4.3,
      discount: 18,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop",
      description: "Perfect for business travelers with modern amenities",
      amenities: ["WiFi", "Conference", "Gym", "Restaurant", "Parking"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Find Your Perfect Hotel
          </h1>
          <div className="grid gap-4 md:grid-cols-6 bg-slate-50 p-4 rounded-2xl">
            <input
              type="text"
              placeholder="Where are you going?"
              className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <input
              type="date"
              className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
              value={filters.checkIn}
              onChange={(e) =>
                setFilters({ ...filters, checkIn: e.target.value })
              }
            />
            <input
              type="date"
              className="h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
              value={filters.checkOut}
              onChange={(e) =>
                setFilters({ ...filters, checkOut: e.target.value })
              }
            />
            <select
              className="h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60"
              value={filters.guests}
              onChange={(e) =>
                setFilters({ ...filters, guests: e.target.value })
              }
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5+ Guests</option>
            </select>
            <button className="h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 col-span-2 md:col-span-1">
              Search
            </button>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="h-12 rounded-xl border border-slate-300 bg-white font-medium hover:bg-slate-50 md:hidden"
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`w-80 shrink-0 ${
              showMobileFilters ? "block" : "hidden"
            } md:block`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Filters</h3>
              <div className="space-y-6">
                <FilterSection
                  title="Price Range"
                  isOpen={openFilters.price}
                  onToggle={() => toggleFilter("price")}
                >
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [0, parseInt(e.target.value)],
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>$0</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </FilterSection>

                <FilterSection
                  title="Star Rating"
                  isOpen={openFilters.rating}
                  onToggle={() => toggleFilter("rating")}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        {"⭐".repeat(rating)} & up
                      </span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection
                  title="Amenities"
                  isOpen={openFilters.amenities}
                  onToggle={() => toggleFilter("amenities")}
                >
                  {[
                    "WiFi",
                    "Pool",
                    "Spa",
                    "Restaurant",
                    "Gym",
                    "Parking",
                    "Beach",
                    "Bar",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={amenity}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter((a) => a !== amenity);
                          setFilters({ ...filters, amenities: newAmenities });
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection
                  title="Location"
                  isOpen={openFilters.location}
                  onToggle={() => toggleFilter("location")}
                >
                  {[
                    "Hà Nội",
                    "TP.HCM",
                    "Đà Nẵng",
                    "Sapa",
                    "Hội An",
                    "Nha Trang",
                  ].map((location) => (
                    <label
                      key={location}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={location}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">{hotels.length} hotels found</p>
              <select className="h-10 rounded-xl border border-slate-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance</option>
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Pagination */}
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
                  3
                </button>
                <button className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPage;
