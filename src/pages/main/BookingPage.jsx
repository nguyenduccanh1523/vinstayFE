import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Modal,
  Spin,
  Empty,
  Row,
  Col,
  Divider,
  Space,
  Typography,
  Image,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { bookingApi } from "../../apis/bookingApi";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getUserBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      toast.error("Failed to fetch your bookings", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCheckInDatePassed = (checkInDate) => {
    if (!checkInDate) {
      // If no check-in date provided, treat as passed to prevent cancellation by default
      return true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate);
    if (isNaN(checkIn.getTime())) {
      return true;
    }
    checkIn.setHours(0, 0, 0, 0);
    return checkIn <= today;
  };

  const handleCancelBooking = (booking) => {
    if (!booking) return;
    const bookingId = booking?._id;
    const hotelName = booking?.hotel_id?.name || "this hotel";
    const check_in_date = booking?.check_in_date;

    if (isCheckInDatePassed(check_in_date)) {
      toast.warning("Cannot cancel booking - check-in date has passed", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    confirm({
      title: "Cancel Booking",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to cancel your booking at ${hotelName}?`,
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      onOk: () => cancelBooking(bookingId),
    });
  };

  const cancelBooking = async (bookingId) => {
    try {
      setCanceling(bookingId);
      await bookingApi.cancelBooking(bookingId);

      toast.success("🎉 Booking cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      fetchUserBookings();
    } catch (error) {
      toast.error(
        `❌ Failed to cancel booking: ${
          error.response?.data?.message || "Please try again"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error("Error cancelling booking:", error);
    } finally {
      setCanceling(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "green",
      pending: "orange",
      cancelled: "red",
      completed: "blue",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const BookingCard = ({ booking }) => {
    console.log("Booking details:", booking);
    if (!booking) return null;
    // defensive defaults if API returns null for hotel_id or room_id
    const hotel = booking.hotel_id || {
      name: "Unknown Hotel",
      images: ["/placeholder-hotel.jpg"],
      address: "",
      city: "",
      country: "",
    };
    const room = booking.room_id || {
      room_number: "N/A",
      room_type: "N/A",
      amenities: [],
    };
    const canCancel =
      (booking.status === "confirmed" || booking.status === "pending") &&
      !isCheckInDatePassed(booking.check_in_date);
    const checkInPassed = isCheckInDatePassed(booking.check_in_date);

    const getImageSrc = (h) => {
      // console.log("Hotel images:", h);
      const imgs = h?.images;
      if (!imgs || imgs.length === 0) return "/placeholder-hotel.jpg";
      const first = imgs[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
      if (first?.path) return first.path;
      return "/placeholder-hotel.jpg";
    };
    const imageSrc = getImageSrc(hotel);

    return (
      <Card
        className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="lg:flex">
          {/* Hotel Image */}
          <div className="lg:w-1/3">
            <Image
              src={imageSrc}
              alt={hotel.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                minHeight: 192,
              }}
              fallback="/placeholder-hotel.jpg"
              preview={false}
            />
          </div>

          {/* Booking Details */}
          <div className="lg:w-2/3 p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
              <div className="flex-1">
                <Title level={3} className="mb-2 text-gray-800">
                  {hotel.name}
                </Title>
                <Space orientation="vertical" size="small" className="mb-4">
                  <Text className="text-gray-600 flex items-center">
                    <EnvironmentOutlined className="mr-2" />
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </Text>
                  <Text className="text-gray-600">
                    Room {room.room_number} - {room.room_type}
                  </Text>
                </Space>
              </div>

              <div className="mt-4 lg:mt-0 lg:ml-6">
                <Tag
                  color={getStatusColor(booking.status)}
                  className="text-sm px-3 py-1"
                >
                  {(booking.status || "unknown").toUpperCase()}
                </Tag>
                {checkInPassed && (
                  <Tag color="orange" className="text-sm px-2 py-1 mt-2">
                    CHECK-IN PASSED
                  </Tag>
                )}
              </div>
            </div>

            <Row gutter={[16, 16]} className="mb-4">
              <Col xs={24} sm={12} md={6}>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <CalendarOutlined className="text-blue-500 text-lg mb-1" />
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="font-semibold text-sm">
                    {formatDate(booking.check_in_date)}
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CalendarOutlined className="text-green-500 text-lg mb-1" />
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="font-semibold text-sm">
                    {formatDate(booking.check_out_date)}
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <UserOutlined className="text-purple-500 text-lg mb-1" />
                  <div className="text-xs text-gray-500">Guests</div>
                  <div className="font-semibold text-sm">
                    {booking.total_guests}{" "}
                    {booking.total_guests === 1 ? "Guest" : "Guests"}
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <DollarOutlined className="text-yellow-600 text-lg mb-1" />
                  <div className="text-xs text-gray-500">Total Price</div>
                  <div className="font-bold text-sm text-green-600">
                    ${booking.total_price}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Room Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="mb-4">
                <Text className="text-sm text-gray-500 mb-2 block">
                  Room Amenities:
                </Text>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <Tag
                      key={index}
                      icon={<WifiOutlined />}
                      className="text-xs"
                    >
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Divider className="my-4" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Booked on {formatDate(booking.created_at)}
              </div>

              {canCancel ? (
                <Button
                  type="primary"
                  danger
                  loading={canceling === booking._id}
                  onClick={() => handleCancelBooking(booking)}
                  className="w-full sm:w-auto"
                >
                  Cancel Booking
                </Button>
              ) : checkInPassed ? (
                <Button
                  disabled
                  className="w-full sm:w-auto"
                  title="Cannot cancel - check-in date has passed"
                >
                  Cannot Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Title level={1} className="text-gray-800 mb-2">
            My Bookings
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            Manage your hotel reservations
          </Paragraph>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Empty
              description="No bookings found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" size="large" href="/hotels">
                Browse Hotels
              </Button>
            </Empty>
          </div>
        ) : (
          <div>
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
