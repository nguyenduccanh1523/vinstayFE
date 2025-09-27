import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Statistic,
  Row,
  Col,
  Avatar,
  Tooltip,
  Image,
  message,
  Skeleton,
  Empty,
  Modal,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { bookingApi } from "../../apis/bookingApi";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllBookings();
      console.log("All bookings:", res);
      setBookings(res.bookings || []);
      setFilteredBookings(res.bookings || []);
    } catch (error) {
      message.error("Failed to load bookings");
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Filter bookings based on search, status, and date
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (booking) =>
          booking.user_id?.username
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          booking.user_id?.email
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          booking.hotel_id?.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          booking.room_id?.room_number
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter.length === 2) {
      filtered = filtered.filter((booking) => {
        const checkIn = dayjs(booking.check_in_date);
        return checkIn.isBetween(dateFilter[0], dateFilter[1], "day", "[]");
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchText, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "orange",
      confirmed: "green",
      cancelled: "red",
      completed: "blue",
    };
    return colors[status] || "default";
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (id) => (
        <span className="font-mono text-xs text-gray-600">{id.slice(-8)}</span>
      ),
    },
    {
      title: "Guest",
      key: "guest",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-medium text-gray-900">
              {record.user_id?.username || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              {record.user_id?.email || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hotel & Room",
      key: "hotel_room",
      width: 250,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <HomeOutlined className="text-blue-500" />
            <span className="font-medium text-gray-900">
              {record.hotel_id?.name || "N/A"}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Room {record.room_id?.room_number} - {record.room_id?.room_type}
          </div>
          <div className="text-xs text-gray-400">
            {record.hotel_id?.city}, {record.hotel_id?.country}
          </div>
        </div>
      ),
    },
    {
      title: "Check-in/out",
      key: "dates",
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <CalendarOutlined className="text-green-500" />
            <span>{dayjs(record.check_in_date).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <CalendarOutlined className="text-red-500" />
            <span>{dayjs(record.check_out_date).format("MMM DD, YYYY")}</span>
          </div>
          <div className="text-xs text-gray-500">
            {dayjs(record.check_out_date).diff(
              dayjs(record.check_in_date),
              "day"
            )}{" "}
            nights
          </div>
        </div>
      ),
    },
    {
      title: "Guests",
      dataIndex: "total_guests",
      key: "total_guests",
      width: 80,
      render: (guests) => (
        <div className="text-center">
          <div className="font-medium">{guests}</div>
          <div className="text-xs text-gray-500">guests</div>
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      width: 120,
      render: (price) => (
        <div className="text-right">
          <div className="font-bold text-green-600 text-lg">
            ${price?.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewBooking(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage all hotel bookings across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={stats.total}
                prefix={<CalendarOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pending}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Confirmed"
                value={stats.confirmed}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                suffix="USD"
                valueStyle={{ color: "#f5222d" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by guest, hotel, room..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full"
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="completed">Completed</Option>
            </Select>
            <RangePicker
              placeholder={["Check-in from", "Check-in to"]}
              onChange={setDateFilter}
              className="w-full"
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText("");
                setStatusFilter("all");
                setDateFilter([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              All Bookings ({filteredBookings.length})
            </h2>
            <Button onClick={loadBookings} loading={loading}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <Skeleton active />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="_id"
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bookings`,
              }}
              locale={{
                emptyText: <Empty description="No bookings found" />,
              }}
              className="overflow-hidden"
            />
          )}
        </Card>
      </div>

      {/* View Booking Modal */}
      <Modal
        title="Booking Details"
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalOpen(false);
              setSelectedBooking(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <div className="space-y-6">
            <Descriptions
              title="Booking Information"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Booking ID" span={2}>
                <span className="font-mono">{selectedBooking._id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                <span className="font-bold text-green-600 text-lg">
                  ${selectedBooking.total_price?.toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Check-in Date">
                {dayjs(selectedBooking.check_in_date).format("MMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Check-out Date">
                {dayjs(selectedBooking.check_out_date).format("MMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Total Guests">
                {selectedBooking.total_guests}
              </Descriptions.Item>
              <Descriptions.Item label="Nights">
                {dayjs(selectedBooking.check_out_date).diff(
                  dayjs(selectedBooking.check_in_date),
                  "day"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Created At" span={2}>
                {dayjs(selectedBooking.created_at).format("MMM DD, YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Guest Information"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Name">
                {selectedBooking.user_id?.username || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedBooking.user_id?.email || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Hotel Information"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Hotel Name">
                {selectedBooking.hotel_id?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedBooking.hotel_id?.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedBooking.hotel_id?.city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {selectedBooking.hotel_id?.country || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hotel Rating">
                {selectedBooking.hotel_id?.rating || 0} ⭐
              </Descriptions.Item>
              <Descriptions.Item label="Check-in Time">
                {selectedBooking.hotel_id?.check_in_time || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Check-out Time">
                {selectedBooking.hotel_id?.check_out_time || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Room Information"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Room Number">
                {selectedBooking.room_id?.room_number || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Room Type">
                {selectedBooking.room_id?.room_type || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Room Price">
                ${selectedBooking.room_id?.price || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Capacity">
                {selectedBooking.room_id?.capacity || 0} guests
              </Descriptions.Item>
              <Descriptions.Item label="Room Amenities" span={2}>
                <div className="flex flex-wrap gap-1">
                  {selectedBooking.room_id?.amenities?.length > 0 ? (
                    selectedBooking.room_id.amenities.map((amenity, index) => (
                      <Tag key={index} size="small" color="blue">
                        {amenity}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400">No amenities</span>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>

            {selectedBooking.hotel_id?.images?.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-3">Hotel Images</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedBooking.hotel_id.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={120}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                      preview={{ mask: "Preview" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBooking;
