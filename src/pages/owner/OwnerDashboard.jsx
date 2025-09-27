// src/pages/owner/OwnerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Statistic, Skeleton, Empty, Tag } from "antd";
import { useSelector } from "react-redux";
import { hotelApi } from "../../apis/hotelApi";
import { roomApi } from "../../apis/roomApi";
import { bookingApi } from "../../apis/bookingApi";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export default function OwnerDashboard() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!ownerId) return;
    (async () => {
      setLoading(true);
      try {
        const h = await hotelApi.getHotelByOwner(ownerId);
        const hotelsList = Array.isArray(h) ? h : [h];
        setHotels(hotelsList.filter((hotel) => hotel));

        // Load rooms for all hotels
        let allRooms = [];
        if (hotelsList.length > 0) {
          for (const hotel of hotelsList) {
            if (hotel?._id) {
              const rs = await roomApi.getRoomsByHotel(hotel._id);
              allRooms = [...allRooms, ...(rs || [])];
            }
          }
        }
        setRooms(allRooms);

        // Load owner bookings for revenue calculation
        const bookingRes = await bookingApi.getOwnerBookings();
        setBookings(bookingRes.bookings || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [ownerId]);

  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => r.is_available).length;
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;

    // Calculate revenue from confirmed bookings only
    const totalRevenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((s, b) => s + (Number(b.total_price) || 0), 0);

    // Convert VND to USD for display
    const revenueUSD = totalRevenue;

    return {
      totalHotels: hotels.length,
      totalRooms,
      availableRooms,
      totalBookings,
      confirmedBookings,
      revenue: revenueUSD,
    };
  }, [hotels, rooms, bookings]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            {loading ? (
              <Skeleton active />
            ) : hotels.length > 0 ? (
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <HomeOutlined /> Your Hotels ({hotels.length})
                </div>
                <div className="space-y-2 mt-2">
                  {hotels.map((hotel, index) => (
                    <div
                      key={hotel._id || index}
                      className="border-l-4 border-blue-500 pl-3"
                    >
                      <div className="font-medium flex items-center gap-2">
                        {hotel.name}
                        <Tag
                          color={hotel.status === "active" ? "green" : "red"}
                        >
                          {hotel.status?.toUpperCase()}
                        </Tag>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {hotel.address}, {hotel.city}, {hotel.country}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Empty description="No hotels yet" />
            )}
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total Hotels"
              prefix={<HomeOutlined />}
              value={stats.totalHotels}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total Rooms"
              prefix={<AppstoreOutlined />}
              value={stats.totalRooms}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Available"
              value={stats.availableRooms}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total Bookings"
              prefix={<BookOutlined />}
              value={stats.totalBookings}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Confirmed"
              prefix={<CheckCircleOutlined />}
              value={stats.confirmedBookings}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              prefix={<DollarOutlined />}
              value={stats.revenue}
              precision={0}
              valueStyle={{ color: "#f5222d", fontSize: "24px" }}
              suffix="USD"
            />
            <div className="text-gray-500 text-sm mt-2">
              From confirmed bookings only
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
