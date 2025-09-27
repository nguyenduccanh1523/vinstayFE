import React from "react";
import FilterSection from "./atoms/FilterSection";

export default function FiltersSidebar({ filters, onChange, openOnMobile }) {
  return (
    <div className={`w-80 shrink-0 ${openOnMobile ? "block" : "hidden"} md:block`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24">
        <h3 className="text-lg font-semibold mb-6">Filters</h3>

        {/* Rating */}
        <FilterSection title="Star Rating" defaultOpen>
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) =>
                  onChange({ ...filters, rating: parseInt(e.target.value) })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">{"⭐".repeat(rating)} & up</span>
            </label>
          ))}
          <button
            onClick={() => onChange({ ...filters, rating: 0 })}
            className="mt-2 text-xs text-slate-500 hover:text-slate-700"
          >
            Clear rating
          </button>
        </FilterSection>

        {/* Amenities */}
        <FilterSection title="Amenities" defaultOpen>
          {["Wifi","Pool","Spa","Restaurant","Gym","Parking","Beach","Bar","Kitchen","Jacuzzi"].map((amenity) => {
            const checked = filters.amenities.includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter((a) => a !== amenity);
                    onChange({ ...filters, amenities: next });
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            );
          })}
        </FilterSection>

        {/* Location quick pick */}
        <FilterSection title="Location" defaultOpen>
          {["Hà Nội","TP.HCM","Đà Nẵng","Sapa","Hội An","Nha Trang"].map((loc) => (
            <button
              key={loc}
              onClick={() => onChange({ ...filters, location: loc })}
              className="text-sm text-slate-700 hover:text-slate-900 block text-left"
            >
              {loc}
            </button>
          ))}
        </FilterSection>
      </div>
    </div>
  );
}
