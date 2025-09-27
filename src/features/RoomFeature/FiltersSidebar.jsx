import React from "react";

function Section({ title, children, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-slate-900 mb-3"
      >
        {title}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
}

export default function FiltersSidebar({
  filters,
  setFilters,
  openFilters,
  toggleFilter,
  visible,
}) {
  return (
    <div className={`w-80 shrink-0 ${visible ? "block" : "hidden"} md:block`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24">
        <h3 className="text-lg font-semibold mb-6">Filter Rooms</h3>
        <div className="space-y-6">
          <Section
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
                  setFilters((p) => ({ ...p, priceRange: [0, parseInt(e.target.value)] }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>$0</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </Section>

          <Section
            title="Room Type"
            isOpen={openFilters.roomType}
            onToggle={() => toggleFilter("roomType")}
          >
            {["Standard", "Deluxe", "Suite", "Executive", "Presidential", "Family"].map(
              (roomType) => (
                <label key={roomType} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={roomType} className="w-4 h-4" />
                  <span className="text-sm">{roomType}</span>
                </label>
              )
            )}
          </Section>

          <Section
            title="View"
            isOpen={openFilters.view}
            onToggle={() => toggleFilter("view")}
          >
            {["City View", "Ocean View", "Garden View", "Mountain View", "Courtyard View"].map(
              (view) => (
                <label key={view} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={view} className="w-4 h-4" />
                  <span className="text-sm">{view}</span>
                </label>
              )
            )}
          </Section>

          <Section
            title="Amenities"
            isOpen={openFilters.amenities}
            onToggle={() => toggleFilter("amenities")}
          >
            {["WiFi", "Mini Bar", "Balcony", "Jacuzzi", "Kitchen", "Bathtub", "Safe", "AC"].map(
              (amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={amenity}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFilters((p) => ({
                        ...p,
                        amenities: checked
                          ? [...p.amenities, amenity]
                          : p.amenities.filter((a) => a !== amenity),
                      }));
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              )
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
