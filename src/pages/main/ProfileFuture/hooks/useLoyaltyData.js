import { useState, useEffect } from "react";
import { bookingApi } from "../../../../apis/bookingApi";

export const useLoyaltyData = (user) => {
  const [bookings, setBookings] = useState([]);
  const [loyaltyData, setLoyaltyData] = useState({
    confirmedBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getUserBookings();
        const userBookings = response.bookings || [];
        setBookings(userBookings);

        // Calculate loyalty metrics - only count confirmed and completed bookings
        const confirmedBookings = userBookings.filter(
          (booking) =>
            booking.status === "confirmed" || booking.status === "completed"
        );

        // Calculate total spent in USD from confirmed bookings only
        const totalSpent = confirmedBookings.reduce((sum, booking) => {
          // Handle different possible field names for total amount
          const bookingAmount =
            booking.totalAmount ||
            booking.total_amount ||
            booking.totalPrice ||
            booking.total_price ||
            booking.amount ||
            0;

          // Convert to USD if the amount is in a different currency
          // Assuming the API returns amounts in USD or we need to convert
          return sum + Number(bookingAmount);
        }, 0);

        // Calculate loyalty points with tier multiplier
        // Base: 1 point per $10 spent + 100 points per confirmed booking
        const pointsFromSpending = Math.floor(totalSpent / 10);
        const pointsFromBookings = confirmedBookings.length * 100;
        const basePoints = pointsFromSpending + pointsFromBookings;

        // Apply tier multiplier (will be calculated in component)
        const loyaltyPoints = basePoints;

        setLoyaltyData({
          confirmedBookings: confirmedBookings.length,
          totalSpent: Math.round(totalSpent * 100) / 100, // Round to 2 decimal places
          loyaltyPoints,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoyaltyData((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  return { bookings, ...loyaltyData };
};
