import React, { useState } from "react";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt="Room view"
          className="h-80 md:h-96 w-full object-cover"
        />
        <button
          onClick={() => setShowAllImages(!showAllImages)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium hover:bg-white"
        >
          📷 {images.length} photos
        </button>
      </div>

      {showAllImages ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setShowAllImages(false);
              }}
              className="rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image}
                alt={`View ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                selectedImage === index
                  ? "border-slate-900"
                  : "border-transparent"
              }`}
            >
              <img
                src={image}
                alt={`View ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AmenityIcon = ({ amenity }) => {
  const icons = {
    WiFi: "📶",
    "Mini Bar": "🍸",
    AC: "❄️",
    Safe: "🔒",
    TV: "📺",
    Bathtub: "🛁",
    Balcony: "🌅",
    Kitchen: "👨‍🍳",
    Jacuzzi: "🛀",
    "Room Service": "🛎️",
    Desk: "💻",
    "Coffee Machine": "☕",
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
      <span className="text-xl">{icons[amenity] || "•"}</span>
      <span className="text-sm font-medium">{amenity}</span>
    </div>
  );
};

const PricingCard = ({ basePrice, dates, guests }) => {
  const nights = 3; // Sample calculation
  const subtotal = basePrice * nights;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

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
            className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            defaultValue="2024-12-20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
            defaultValue="2024-12-23"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Guests
          </label>
          <select className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60">
            <option>2 Guests</option>
            <option>1 Guest</option>
            <option>3 Guests</option>
            <option>4 Guests</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 mb-6 py-4 border-t border-b border-slate-200">
        <div className="flex justify-between text-sm">
          <span>
            ${basePrice} x {nights} nights
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

      <button className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 mb-4">
        Reserve Now
      </button>

      <div className="text-center text-sm text-slate-600">
        You won't be charged yet
      </div>
    </div>
  );
};

const RoomDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample room data
  const room = {
    name: "Executive Suite",
    hotel: "Grand Palace Hotel",
    hotelLocation: "Hà Nội, Hoàn Kiếm",
    price: 459,
    rating: 4.9,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Indulge in luxury with our Executive Suite featuring a separate living area, panoramic city views, and premium amenities. Perfect for extended stays or special occasions.",
    bedType: "King Bed",
    maxGuests: 4,
    size: 65,
    view: "City View",
    amenities: [
      "WiFi",
      "Mini Bar",
      "AC",
      "Safe",
      "TV",
      "Bathtub",
      "Balcony",
      "Kitchen",
      "Jacuzzi",
      "Room Service",
      "Desk",
      "Coffee Machine",
    ],
    features: [
      "Separate living and sleeping areas",
      "Floor-to-ceiling windows",
      "Premium bedding and linens",
      "Marble bathroom with soaking tub",
      "Fully equipped kitchenette",
      "Private balcony with city views",
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation until 24 hours before check-in",
      pets: "Pets not allowed",
      smoking: "Non-smoking room",
      children: "Children of all ages welcome",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <a href="/" className="hover:text-slate-900">
              Home
            </a>
            <span>›</span>
            <a href="/hotels" className="hover:text-slate-900">
              Hotels
            </a>
            <span>›</span>
            <a href="/hotel-detail/1" className="hover:text-slate-900">
              {room.hotel}
            </a>
            <span>›</span>
            <span className="text-slate-900">{room.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {room.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-slate-600">
                      📍 {room.hotel}, {room.hotelLocation}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-medium">{room.rating}</span>
                      <span className="text-slate-600">
                        ({room.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">
                  ♥ Save
                </button>
              </div>

              {/* Room Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">🛏️</div>
                  <div className="text-sm text-slate-600">{room.bedType}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-sm text-slate-600">
                    {room.maxGuests} guests
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="text-sm text-slate-600">{room.size} m²</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-2xl mb-1">🪟</div>
                  <div className="text-sm text-slate-600">{room.view}</div>
                </div>
              </div>

              {/* Image Gallery */}
              <ImageGallery images={room.images} />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="flex gap-8">
                {["overview", "amenities", "policies"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    About this room
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    {room.description}
                  </p>

                  <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {room.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Room Amenities</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {room.amenities.map((amenity, index) => (
                    <AmenityIcon key={index} amenity={amenity} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "policies" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  Policies & Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Check-in/Check-out</h4>
                      <p className="text-sm text-slate-600">
                        Check-in: {room.policies.checkIn}
                      </p>
                      <p className="text-sm text-slate-600">
                        Check-out: {room.policies.checkOut}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cancellation</h4>
                      <p className="text-sm text-slate-600">
                        {room.policies.cancellation}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">House Rules</h4>
                      <p className="text-sm text-slate-600">
                        {room.policies.pets}
                      </p>
                      <p className="text-sm text-slate-600">
                        {room.policies.smoking}
                      </p>
                      <p className="text-sm text-slate-600">
                        {room.policies.children}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingCard basePrice={room.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
