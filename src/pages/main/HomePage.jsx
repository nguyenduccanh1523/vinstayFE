import React from "react";

const FeatureCard = ({ title, desc, icon }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
    <div className="h-11 w-11 rounded-xl bg-slate-900 text-white grid place-items-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-slate-600 text-sm">{desc}</p>
  </div>
);

const RoomCard = ({ img, title, price }) => (
  <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
    <img src={img} alt={title} className="h-56 w-full object-cover" />
    <div className="p-5">
      <div className="flex items-start justify-between">
        <h4 className="text-base font-semibold">{title}</h4>
        <span className="text-sm text-slate-600">
          from <span className="font-semibold text-slate-900">${price}</span>
          /night
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">City view • King bed • 30m²</p>
      <button className="mt-4 h-10 w-full rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
        <a
          href="/room-detail/1"
          className="block w-full h-full grid place-items-center"
        >
          View Details
        </a>
      </button>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <>
      <section className="relative">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-E4GO5a7loABP-CIsGOF40lXynjt3MR0sRA&s"
          alt="Hotel lobby with warm lights"
          className="h-[68vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
                Stay in the heart of the city
              </h1>
              <p className="mt-3 text-white/90">
                Luxury rooms, curated dining, and spa rituals designed for deep
                rest.
              </p>
              {/* Booking bar */}
              <form className="mt-6 grid gap-3 sm:grid-cols-5 bg-white/95 backdrop-blur p-3 rounded-2xl border border-white shadow-xl">
                <input
                  type="text"
                  placeholder="Location"
                  className="h-11 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                />
                <input
                  type="date"
                  aria-label="Check-in"
                  className="h-11 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                />
                <input
                  type="date"
                  aria-label="Check-out"
                  className="h-11 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                />
                <select
                  aria-label="Guests"
                  className="h-11 rounded-xl border border-slate-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                >
                  <option>2 Guests</option>
                  <option>1 Guest</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                </select>
                <button className="h-11 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800">
                  Search
                </button>
              </form>
              <div className="mt-3 text-white/80 text-sm">
                Rated 4.8/5 by 3,000+ guests • Free cancellation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title="Central Location"
            desc="Steps from museums, shopping, and nightlife."
            icon={<span>📍</span>}
          />
          <FeatureCard
            title="Signature Dining"
            desc="Chef-driven menus from breakfast to late-night."
            icon={<span>🍽️</span>}
          />
          <FeatureCard
            title="Wellness & Spa"
            desc="Steam, sauna, and tailored treatments."
            icon={<span>💆</span>}
          />
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Featured Rooms</h2>
            <a href="/rooms" className="text-sm text-slate-700 hover:underline">
              See all rooms
            </a>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <RoomCard
              title="Deluxe King"
              price={139}
              img="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop"
            />
            <RoomCard
              title="Executive Suite"
              price={219}
              img="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
            />
            <RoomCard
              title="Twin City View"
              price={159}
              img="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-slate-900 text-white p-10 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xl leading-relaxed">
              “Hands down the best hotel experience in the city. The spa is
              heavenly and the breakfast… unreal.”
            </p>
            <div className="mt-4 text-sm text-white/80">
              — Jordan P., stayed Aug 2025
            </div>
          </div>
          <img
            className="rounded-2xl w-full h-64 object-cover"
            src="https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1400&auto=format&fit=crop"
            alt="Spa room"
          />
        </div>
      </section>

      {/* CTA */}
      <section id="offers" className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 grid gap-6 md:grid-cols-2 items-center shadow-sm">
            <div>
              <h3 className="text-2xl font-semibold">
                Members save 10% on direct bookings
              </h3>
              <p className="mt-2 text-slate-600">
                Join free today and access insider rates, late checkout, and
                welcome drinks.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <a
                href="/register"
                className="h-11 rounded-xl bg-slate-900 text-white px-5 grid place-items-center font-medium hover:bg-slate-800"
              >
                Create Account
              </a>
              <a
                href="/hotels"
                className="h-11 rounded-xl border border-slate-300 px-5 grid place-items-center font-medium hover:bg-slate-50"
              >
                Browse Hotels
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
