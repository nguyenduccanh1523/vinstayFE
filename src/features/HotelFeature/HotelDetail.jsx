import React, { useState } from "react";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="grid gap-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt="Hotel main view"
          className="h-96 md:h-[500px] w-full object-cover"
        />
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium hover:bg-white">
          📷 View all photos
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-slate-900"
                : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt={`View ${index + 1}`}
              className="h-20 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const RoomCard = ({ room }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex gap-4">
      <img
        src={room.image}
        alt={room.name}
        className="h-24 w-32 rounded-xl object-cover"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">{room.name}</h4>
            <p className="text-sm text-slate-600 mt-1">{room.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
              <span>🛏️ {room.bedType}</span>
              <span>👥 {room.maxGuests} guests</span>
              <span>📐 {room.size}m²</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">
              ${room.price}
            </div>
            <div className="text-sm text-slate-600">/night</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
          <a
            href={`/room-detail/${room.id}`}
            className="h-10 px-6 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
          >
            Select Room
          </a>
        </div>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium">
        {review.author.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium text-slate-900">{review.author}</h4>
            <p className="text-sm text-slate-600">{review.date}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium">{review.rating}</span>
          </div>
        </div>
        <p className="text-slate-700">{review.comment}</p>
      </div>
    </div>
  </div>
);

const HotelDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample hotel data
  const hotel = {
    name: "Grand Palace Hotel",
    location: "Hà Nội, Hoàn Kiếm",
    rating: 4.8,
    reviewCount: 1247,
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Experience luxury in the heart of Hanoi's Old Quarter. Our elegant hotel combines traditional Vietnamese hospitality with modern amenities, offering guests an unforgettable stay in one of the city's most vibrant neighborhoods.",
    amenities: [
      "Free WiFi",
      "Swimming Pool",
      "Spa & Wellness",
      "Restaurant",
      "Fitness Center",
      "Room Service",
      "Concierge",
      "Parking",
      "Airport Shuttle",
      "Business Center",
      "Laundry Service",
      "Bar",
    ],
    highlights: [
      "Prime location in Old Quarter",
      "Rooftop pool with city views",
      "Award-winning restaurant",
      "24/7 concierge service",
    ],
  };

  const rooms = [
    {
      id: 1,
      name: "Deluxe King Room",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop",
      description: "Spacious room with panoramic city views",
      bedType: "King Bed",
      maxGuests: 2,
      size: 35,
      amenities: ["WiFi", "Mini Bar", "AC", "Safe", "TV"],
    },
    {
      id: 2,
      name: "Executive Suite",
      price: 459,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop",
      description: "Luxury suite with separate living area",
      bedType: "King Bed",
      maxGuests: 4,
      size: 65,
      amenities: ["WiFi", "Kitchen", "Balcony", "Jacuzzi", "TV"],
    },
  ];

  const reviews = [
    {
      author: "Sarah Johnson",
      rating: 5.0,
      date: "Dec 2024",
      comment:
        "Absolutely stunning hotel! The service was impeccable and the location couldn't be better. The rooftop pool has amazing views of the city.",
    },
    {
      author: "Michael Chen",
      rating: 4.8,
      date: "Nov 2024",
      comment:
        "Great stay overall. The room was spacious and clean, staff was very helpful. Only minor issue was the WiFi speed in some areas.",
    },
    {
      author: "Emma Wilson",
      rating: 4.9,
      date: "Nov 2024",
      comment:
        "Perfect location for exploring the Old Quarter. The hotel restaurant serves excellent Vietnamese cuisine. Highly recommended!",
    },
  ];

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
            <span className="text-slate-900">{hotel.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-medium">{hotel.rating}</span>
                      <span className="text-slate-600">
                        ({hotel.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="text-slate-600">📍 {hotel.location}</span>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">
                  ♥ Save
                </button>
              </div>

              {/* Image Gallery */}
              <ImageGallery images={hotel.images} />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="flex gap-8">
                {["overview", "rooms", "amenities", "reviews"].map((tab) => (
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
                    About this hotel
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {hotel.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Available Rooms</h3>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Hotel Amenities</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Guest Reviews</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{hotel.rating}</span>
                    <div>
                      <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <div className="text-sm text-slate-600">
                        {hotel.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-slate-900">
                  ${hotel.price}
                </div>
                <div className="text-slate-600">per night</div>
              </div>

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

                <button className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800">
                  Check Availability
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between text-sm mb-2">
                  <span>3 nights</span>
                  <span>$897</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Service fee</span>
                  <span>$45</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>$942</span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-600">
                Free cancellation until 24 hours before check-in
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
