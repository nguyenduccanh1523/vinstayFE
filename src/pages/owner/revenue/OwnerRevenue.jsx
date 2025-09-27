// src/pages/owner/revenue/OwnerRevenue.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { bookingApi } from "../../../apis/bookingApi";
import {
  Card,
  Col,
  Row,
  Statistic,
  DatePicker,
  Table,
  Progress,
  Tag,
} from "antd";
import {
  DollarOutlined,
  TrophyOutlined,
  CalendarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function OwnerRevenue() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    count: 0,
    avg: 0,
    confirmedCount: 0,
  });
  const [topRooms, setTopRooms] = useState([]);
  const [topHotels, setTopHotels] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getOwnerBookings();
      let filteredBookings = res.bookings || [];

      // Filter by date range if selected
      if (dateRange.length === 2) {
        const [start, end] = dateRange;
        filteredBookings = filteredBookings.filter((booking) => {
          const bookingDate = dayjs(booking.created_at);
          return (
            bookingDate.isAfter(start.startOf("day")) &&
            bookingDate.isBefore(end.endOf("day"))
          );
        });
      }

      setBookings(filteredBookings);
      calculateSummary(filteredBookings);
      calculateTopPerformers(filteredBookings);
    } catch (error) {
      console.error("Failed to load revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (bookings) => {
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const total = confirmedBookings.reduce(
      (sum, booking) => sum + (booking.total_price || 0),
      0
    );
    const count = bookings.length;
    const confirmedCount = confirmedBookings.length;
    const avg = confirmedCount > 0 ? total / confirmedCount : 0;

    setSummary({
      total: total, // Convert VND to USD (approximate rate)
      count,
      confirmedCount,
      avg: avg,
    });
  };

  const calculateTopPerformers = (bookings) => {
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

    // Calculate top rooms
    const roomStats = {};
    const hotelStats = {};

    confirmedBookings.forEach((booking) => {
      const roomId = booking.room_id?._id;
      const hotelId = booking.hotel_id?._id;

      if (roomId) {
        if (!roomStats[roomId]) {
          roomStats[roomId] = {
            room_id: roomId,
            room_number: booking.room_id.room_number,
            room_type: booking.room_id.room_type,
            hotel_name: booking.hotel_id?.name,
            orders: 0,
            revenue: 0,
          };
        }
        roomStats[roomId].orders += 1;
        roomStats[roomId].revenue += booking.total_price;
      }

      if (hotelId) {
        if (!hotelStats[hotelId]) {
          hotelStats[hotelId] = {
            hotel_id: hotelId,
            hotel_name: booking.hotel_id.name,
            city: booking.hotel_id.city,
            orders: 0,
            revenue: 0,
          };
        }
        hotelStats[hotelId].orders += 1;
        hotelStats[hotelId].revenue += booking.total_price;
      }
    });

    const topRoomsData = Object.values(roomStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const topHotelsData = Object.values(hotelStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopRooms(topRoomsData);
    setTopHotels(topHotelsData);
  };

  useEffect(() => {
    if (ownerId) load();
  }, [ownerId, dateRange]);

  const roomColumns = useMemo(
    () => [
      {
        title: "Room",
        dataIndex: "room_number",
        render: (number, record) => (
          <div>
            <div className="font-medium">#{number}</div>
            <div className="text-sm text-gray-500">{record.hotel_name}</div>
          </div>
        ),
      },
      {
        title: "Type",
        dataIndex: "room_type",
        render: (type) => <Tag color="blue">{type}</Tag>,
      },
      {
        title: "Bookings",
        dataIndex: "orders",
        render: (orders) => <span className="font-medium">{orders}</span>,
      },
      {
        title: "Revenue",
        dataIndex: "revenue",
        render: (revenue) => (
          <span className="text-green-600 font-medium">
            ${revenue.toFixed(0)}
          </span>
        ),
      },
      {
        title: "Performance",
        dataIndex: "revenue",
        render: (revenue, _, index) => {
          const maxRevenue = topRooms[0]?.revenue || 1;
          const percentage = (revenue / maxRevenue) * 100;
          return <Progress percent={Math.round(percentage)} size="small" />;
        },
      },
    ],
    [topRooms]
  );

  const hotelColumns = useMemo(
    () => [
      {
        title: "Hotel",
        dataIndex: "hotel_name",
        render: (name, record) => (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.city}</div>
          </div>
        ),
      },
      {
        title: "Bookings",
        dataIndex: "orders",
        render: (orders) => <span className="font-medium">{orders}</span>,
      },
      {
        title: "Revenue",
        dataIndex: "revenue",
        render: (revenue) => (
          <span className="text-green-600 font-medium">
            ${revenue.toFixed(0)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-gray-800">
          Revenue Dashboard
        </div>
        <RangePicker
          onChange={(dates) => setDateRange(dates || [])}
          placeholder={["Start Date", "End Date"]}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              prefix={<DollarOutlined className="text-green-500" />}
              value={summary.total}
              precision={0}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Bookings"
              prefix={<CalendarOutlined className="text-blue-500" />}
              value={summary.count}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Confirmed Bookings"
              prefix={<TrophyOutlined className="text-yellow-500" />}
              value={summary.confirmedCount}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Avg per Booking"
              prefix={<RiseOutlined className="text-purple-500" />}
              value={summary.avg}
              precision={0}
              valueStyle={{ color: "#8b5cf6" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} xl={14}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-yellow-500" />
                <span>Top Performing Rooms</span>
              </div>
            }
            className="shadow-sm"
          >
            <Table
              rowKey="room_id"
              columns={roomColumns}
              dataSource={topRooms}
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <DollarOutlined className="text-green-500" />
                <span>Top Hotels by Revenue</span>
              </div>
            }
            className="shadow-sm"
          >
            <Table
              rowKey="hotel_id"
              columns={hotelColumns}
              dataSource={topHotels}
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
