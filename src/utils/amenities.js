// utils/amenities.js
export const AMENITY_META = {
  Wifi: { icon: "📶", label: "WiFi" },
  "Free WiFi": { icon: "📶", label: "WiFi" },
  "Mini Bar": { icon: "🍸", label: "Mini Bar" },
  "Mini-bar": { icon: "🍸", label: "Mini Bar" },
  Kitchen: { icon: "👨‍🍳", label: "Kitchen" },
  Jacuzzi: { icon: "🛀", label: "Jacuzzi" },
  Balcony: { icon: "🌅", label: "Balcony" },
  TV: { icon: "📺", label: "TV" },
  AC: { icon: "❄️", label: "Air Conditioning" },
  Safe: { icon: "🔒", label: "Safe" },
  Spa: { icon: "💆", label: "Spa" },
  Pool: { icon: "🏊", label: "Pool" },
  Parking: { icon: "🅿️", label: "Parking" },
  Restaurant: { icon: "🍽️", label: "Restaurant" },
  Gym: { icon: "🏋️", label: "Gym" },
  Beach: { icon: "🏖️", label: "Beach" },
  Bar: { icon: "🍹", label: "Bar" },
  Bida: { icon: "🎱", label: "Billiards" },
};

// Chuẩn hoá list amenities (string[]) -> array {key, icon, label}
export function normalizeAmenities(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((raw) => {
    const key = String(raw || "").trim();
    const meta = AMENITY_META[key] || { icon: "•", label: key };
    return { key, ...meta };
  });
}

export const AMENITY_ICONS = {
  WiFi: "📶",
  "Mini-bar": "🍸",
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
  "Pickle ball": "🏓",
};

export function normalizeAmenity(a = "") {
  return String(a).trim();
}

export function diffNights(fromISO, toISO) {
  if (!fromISO || !toISO) return 1;
  // dùng UTC để tránh lệch múi giờ
  const a = new Date(`${fromISO}T00:00:00Z`);
  const b = new Date(`${toISO}T00:00:00Z`);
  const ms = Math.max(0, b - a);
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return nights || 1;
}
