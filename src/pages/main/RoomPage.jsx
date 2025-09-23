import React, { useState } from "react";

const RoomCard = ({ room }) => (
  <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="relative">
      <img
        src={room.image}
        alt={room.name}
        className="h-48 w-full object-cover"
      />
      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
        Available
      </div>
      {room.discount && (
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
          -{room.discount}%
        </div>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
        <div className="text-right">
          <span className="text-xl font-bold text-slate-900">
            ${room.price}
          </span>
          <p className="text-xs text-slate-500">/night</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-3">{room.description}</p>
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-slate-600">
        <div>🛏️ {room.bedType}</div>
        <div>👥 {room.maxGuests} guests</div>
        <div>📐 {room.size} m²</div>
        <div>🪟 {room.view}</div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {room.amenities.map((amenity, index) => (
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
          href={`/room-detail/${room.id}`}
          className="flex-1 h-10 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
        >
          Book Now
        </a>
        <a
          href={`/room-detail/${room.id}`}
          className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 grid place-items-center"
        >
          Details
        </a>
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

const RoomPage = () => {
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

  const toggleFilter = (filterName) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Sample room data
  const rooms = [
    {
      id: 1,
      name: "Deluxe King Room",
      price: 299,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",
      description:
        "Spacious room with panoramic city views and luxury amenities",
      bedType: "King Bed",
      maxGuests: 2,
      size: 35,
      view: "City View",
      amenities: ["WiFi", "Mini Bar", "AC", "Safe", "TV", "Bathtub"],
    },
    {
      id: 2,
      name: "Executive Suite",
      price: 459,
      discount: 20,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      description:
        "Luxury suite with separate living area and premium services",
      bedType: "King Bed",
      maxGuests: 4,
      size: 65,
      view: "Ocean View",
      amenities: [
        "WiFi",
        "Kitchen",
        "Balcony",
        "Jacuzzi",
        "TV",
        "Butler Service",
      ],
    },
    {
      id: 3,
      name: "Twin City View",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      description: "Comfortable twin room perfect for business travelers",
      bedType: "Twin Beds",
      maxGuests: 2,
      size: 28,
      view: "City View",
      amenities: ["WiFi", "Desk", "AC", "Safe", "TV"],
    },
    {
      id: 4,
      name: "Family Room",
      price: 359,
      discount: 10,
      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1600&auto=format&fit=crop",
      description: "Spacious family room with connecting bedrooms",
      bedType: "Queen + Sofa Bed",
      maxGuests: 6,
      size: 45,
      view: "Garden View",
      amenities: ["WiFi", "Kitchenette", "AC", "Safe", "TV", "Extra Beds"],
    },
    {
      id: 5,
      name: "Presidential Suite",
      price: 899,
      discount: 25,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop",
      description: "Ultimate luxury with private terrace and concierge service",
      bedType: "King Bed",
      maxGuests: 4,
      size: 120,
      view: "Panoramic View",
      amenities: [
        "WiFi",
        "Private Terrace",
        "Jacuzzi",
        "Kitchen",
        "Butler",
        "Spa Access",
      ],
    },
    {
      id: 6,
      name: "Standard Double",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
      description: "Cozy and comfortable room with modern amenities",
      bedType: "Double Bed",
      maxGuests: 2,
      size: 22,
      view: "Courtyard View",
      amenities: ["WiFi", "AC", "Safe", "TV", "Shower"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Available Rooms
              </h1>
              
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-5 bg-slate-50 p-4 rounded-2xl">
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
            <button className="h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800">
              Update Search
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
              <h3 className="text-lg font-semibold mb-6">Filter Rooms</h3>
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
                  title="Bed Type"
                  isOpen={openFilters.bedType}
                  onToggle={() => toggleFilter("bedType")}
                >
                  {[
                    "King Bed",
                    "Queen Bed",
                    "Twin Beds",
                    "Double Bed",
                    "Sofa Bed",
                  ].map((bedType) => (
                    <label
                      key={bedType}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="bedType"
                        value={bedType}
                        onChange={(e) =>
                          setFilters({ ...filters, bedType: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{bedType}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection
                  title="Room Type"
                  isOpen={openFilters.roomType}
                  onToggle={() => toggleFilter("roomType")}
                >
                  {[
                    "Standard",
                    "Deluxe",
                    "Suite",
                    "Executive",
                    "Presidential",
                    "Family",
                  ].map((roomType) => (
                    <label
                      key={roomType}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={roomType}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{roomType}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection
                  title="View"
                  isOpen={openFilters.view}
                  onToggle={() => toggleFilter("view")}
                >
                  {[
                    "City View",
                    "Ocean View",
                    "Garden View",
                    "Mountain View",
                    "Courtyard View",
                  ].map((view) => (
                    <label
                      key={view}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input type="checkbox" value={view} className="w-4 h-4" />
                      <span className="text-sm">{view}</span>
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
                    "Mini Bar",
                    "Balcony",
                    "Jacuzzi",
                    "Kitchen",
                    "Bathtub",
                    "Safe",
                    "AC",
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
              </div>
            </div>
          </div>

          {/* Room Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">{rooms.length} rooms available</p>
              <select className="h-10 rounded-xl border border-slate-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Size: Large to Small</option>
                <option>Most Popular</option>
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-8">
              <button className="h-12 px-8 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium">
                Load More Rooms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
