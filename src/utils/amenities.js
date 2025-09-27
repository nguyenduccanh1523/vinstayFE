// utils/amenities.js
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
