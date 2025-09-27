import React from "react";

const StarRow = ({ rating = 0 }) => {
  const full = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-slate-600">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

export default function HotelCard({ hotel }) {
  const {
    id, name, location, price, rating, discount, image, description, amenities = []
  } = hotel;

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/800x400?text=Hotel"}
          alt={name}
          className="h-56 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium">
          <StarRow rating={rating} />
        </div>
        {discount != null && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            -{discount}%
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          {price != null && (
            <span className="text-lg font-bold text-slate-900">
              ${price}/night
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 mb-2">📍 {location}</p>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{description}</p>

        {!!amenities.length && (
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.slice(0, 6).map((a, i) => (
              <span
                key={`${a}-${i}`}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
              >
                {a}
              </span>
            ))}
            {amenities.length > 6 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                +{amenities.length - 6}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <a
            href={`/hotel-detail/${id}`}
            className="flex-1 h-10 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 grid place-items-center"
          >
            View Details
          </a>
          <button
            title="Save"
            className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}
