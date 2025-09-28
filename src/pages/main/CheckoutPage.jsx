import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingApi } from "../../apis/bookingApi";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingData = state?.bookingData;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentType, setPaymentType] = useState("full"); // 'full' or 'deposit'
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            No booking data found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const depositAmount = Math.round(bookingData.total * 0.3);
  const finalAmount =
    paymentType === "deposit" ? depositAmount : bookingData.total;

  const handleCardInputChange = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setLoading(true);

    const toastId = toast.loading("Processing your payment...", {
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    });

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking via API
      const bookingPayload = {
        room_id: bookingData.roomId,
        hotel_id: bookingData.hotelId,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        total_guests: bookingData.guests,
        total_price: bookingData.total,
      };

      const result = await bookingApi.createBooking(bookingPayload);

      toast.update(toastId, {
        render: `🎉 Payment Successful! Booking ID: ${result._id || "N/A"}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/bookings", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);

      toast.update(toastId, {
        render: `❌ Payment Failed: ${
          error.response?.data?.message || "Please try again"
        }`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-2">Complete your reservation</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Type Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Payment Options
              </h3>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full"
                    checked={paymentType === "full"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-slate-900">
                      Pay in Full
                    </div>
                    <div className="text-sm text-slate-600">
                      Pay the complete amount now
                    </div>
                    <div className="text-lg font-semibold text-slate-900 mt-1">
                      ${bookingData.total}
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === "deposit"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-slate-900">
                      Pay Deposit (30%)
                    </div>
                    <div className="text-sm text-slate-600">
                      Pay 30% now, remaining at hotel
                    </div>
                    <div className="text-lg font-semibold text-slate-900 mt-1">
                      ${depositAmount}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Payment Method
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-slate-900">
                      💳 Bank Card
                    </div>
                    <div className="text-sm text-slate-600">
                      Credit/Debit Card
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-slate-900">
                      🏦 Bank Transfer
                    </div>
                    <div className="text-sm text-slate-600">
                      Direct Transfer
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === "card" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Card Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                      value={cardData.cardHolder}
                      onChange={(e) =>
                        handleCardInputChange("cardHolder", e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                      value={cardData.cardNumber}
                      onChange={(e) =>
                        handleCardInputChange("cardNumber", e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                        value={cardData.expiryDate}
                        onChange={(e) =>
                          handleCardInputChange("expiryDate", e.target.value)
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-slate-900/60"
                        value={cardData.cvv}
                        onChange={(e) =>
                          handleCardInputChange("cvv", e.target.value)
                        }
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Bank Transfer Information
                </h3>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Bank Name:</span>
                    <span className="text-sm font-medium">VinStay Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Account Number:
                    </span>
                    <span className="text-sm font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Account Name:
                    </span>
                    <span className="text-sm font-medium">VinStay Hotels</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Transfer Note:
                    </span>
                    <span className="text-sm font-medium">
                      Booking {bookingData.roomId?.slice(-6)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-3">
                  Please include the booking reference in your transfer note and
                  upload the receipt after payment.
                </p>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="font-medium text-slate-900">
                    {bookingData.roomName}
                  </div>
                  <div className="text-sm text-slate-600">
                    {bookingData.hotelName}
                  </div>
                  <div className="text-sm text-slate-600">
                    📍 {bookingData.hotelLocation}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Check-in:</span>
                    <span className="font-medium">{bookingData.checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Check-out:</span>
                    <span className="font-medium">{bookingData.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Guests:</span>
                    <span className="font-medium">{bookingData.guests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nights:</span>
                    <span className="font-medium">{bookingData.nights}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees:</span>
                    <span>${bookingData.taxes}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-slate-200">
                    <span>Total:</span>
                    <span>${bookingData.total}</span>
                  </div>
                  {paymentType === "deposit" && (
                    <div className="flex justify-between font-semibold text-lg text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                      <span>Amount to Pay:</span>
                      <span>${finalAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={
                  loading ||
                  (paymentMethod === "card" &&
                    (!cardData.cardNumber || !cardData.cardHolder))
                }
                className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Complete Payment ($${finalAmount})`
                )}
              </button>

              <div className="text-center text-xs text-slate-600 mt-3">
                Your payment is secured with 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
