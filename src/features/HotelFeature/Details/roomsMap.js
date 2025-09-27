// map room từ API => state chuẩn để truyền qua Link
export const DEFAULT_SIZE = 32;       // m²
export const DEFAULT_VIEW = "City View";
export const DEFAULT_DISCOUNT = 12;   // %

export function mapApiRoomToCard(r) {
  const hotelName = typeof r.hotel_id === "object" ? r.hotel_id?.name : "";
  const city = typeof r.hotel_id === "object" ? r.hotel_id?.city : "";

  return {
    id: r._id,
    name: `${r.room_type || "Room"}${r.room_number ? ` #${r.room_number}` : ""}${hotelName ? ` - ${hotelName}` : ""}`,
    price: r.price ?? 0,
    discount: DEFAULT_DISCOUNT,
    image: (Array.isArray(r.images) && r.images[0]) || "",
    description: r.description || `${hotelName}${city ? ` • ${city}` : ""}`,
    bedType: r.room_type || "Bed",
    maxGuests: r.capacity || 2,
    size: r.room_area || DEFAULT_SIZE,
    view: r.view || DEFAULT_VIEW,
    amenities: r.amenities || [],
    is_available: !!r.is_available,
    check_in: r.check_in || "3:00 PM",
    check_out: r.check_out || "12:00 PM",
    hotel_name: hotelName,
    hotel_city: city,
  };
}
