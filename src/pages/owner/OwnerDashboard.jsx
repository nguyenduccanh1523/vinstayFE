// src/pages/owner/OwnerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Statistic, Skeleton, Empty, Tag } from "antd";
import { useSelector } from "react-redux";
import { hotelApi } from "../../apis/hotelApi";
import { roomApi } from "../../apis/roomApi";
// import { bookingApi } from "@/apis/bookingApi";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export default function OwnerDashboard() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!ownerId) return;
    (async () => {
      setLoading(true);
      try {
        const h = await hotelApi.getHotelByOwner(ownerId);
        const theHotel = Array.isArray(h) ? h[0] : h;
        setHotel(theHotel || null);

        if (theHotel?._id) {
          const rs = await roomApi.getRoomsByHotel(theHotel._id);
          setRooms(rs || []);
          // const bs = await bookingApi.getBookingsByHotelOwner(ownerId);
          // setBookings(bs || []);
        } else {
          setRooms([]);
          setBookings([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [ownerId]);

  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => r.is_available).length;
    const totalBookings = bookings.length;
    const revenue = bookings.reduce((s, b) => s + (Number(b.total_price) || 0), 0);
    return { totalRooms, availableRooms, totalBookings, revenue };
  }, [rooms, bookings]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            {loading ? (
              <Skeleton active />
            ) : hotel ? (
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <HomeOutlined /> {hotel.name}
                  <Tag color={hotel.status === "active" ? "green" : "red"}>
                    {hotel.status?.toUpperCase()}
                  </Tag>
                </div>
                <div className="text-gray-500">{hotel.address}, {hotel.city}, {hotel.country}</div>
              </div>
            ) : (
              <Empty description="No hotel yet" />
            )}
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic title="Rooms" prefix={<AppstoreOutlined />} value={stats.totalRooms} />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic title="Available" value={stats.availableRooms} />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic title="Bookings" prefix={<BookOutlined />} value={stats.totalBookings} />
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Statistic title="Revenue" prefix={<DollarOutlined />} value={stats.revenue} precision={2} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
