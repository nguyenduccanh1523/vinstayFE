// src/pages/owner/bookings/OwnerBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { bookingApi } from "../../../apis/bookingApi";
import {
  Card,
  DatePicker,
  Table,
  Tag,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Select,
} from "antd";
const { RangePicker } = DatePicker;

export default function OwnerBookings() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getOwnerBookings();
      const bookings = Array.isArray(res.bookings) ? res.bookings : [];
      const pickDate = (it) =>
        it?.createdAt ||
        it?.created_at ||
        it?.check_in_date ||
        it?.updatedAt ||
        it?.updated_at;
      const toMs = (v) => (v ? new Date(v).getTime() : 0);
      const sorted = [...bookings].sort(
        (a, b) => toMs(pickDate(b)) - toMs(pickDate(a))
      );
      setData(sorted);
    } catch (error) {
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingApi.updateBookingStatus(id, { status });
      message.success(`Booking ${status} successfully`);
      load(); // Reload data
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Assuming there's a delete API or we cancel the booking
      await bookingApi.cancelBooking(id);
      message.success("Booking deleted successfully");
      load(); // Reload data
    } catch (error) {
      message.error("Failed to delete booking");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      status: record.status,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await bookingApi.updateBookingStatus(editingRecord._id, values);
      message.success("Booking updated successfully");
      setEditModalVisible(false);
      setEditingRecord(null);
      load();
    } catch (error) {
      message.error("Failed to update booking");
    }
  };

  useEffect(() => {
    if (ownerId) load();
  }, [ownerId]);

  const columns = useMemo(
    () => [
      {
        title: "Customer",
        dataIndex: ["user_id", "email"],
        render: (email, record) => (
          <div>
            <div>{record.user_id?.username}</div>
            <div className="text-gray-500 text-sm">{email}</div>
          </div>
        ),
      },
      {
        title: "Hotel",
        dataIndex: ["hotel_id", "name"],
        render: (name, record) => (
          <div>
            <div>{name}</div>
            <div className="text-gray-500 text-sm">{record.hotel_id?.city}</div>
          </div>
        ),
      },
      {
        title: "Room",
        dataIndex: ["room_id", "room_number"],
        render: (roomNumber, record) => (
          <div>
            <div>#{roomNumber}</div>
            <div className="text-gray-500 text-sm">
              {record.room_id?.room_type}
            </div>
          </div>
        ),
      },
      {
        title: "Check-in",
        dataIndex: "check_in_date",
        render: (v) => new Date(v).toLocaleDateString(),
      },
      {
        title: "Check-out",
        dataIndex: "check_out_date",
        render: (v) => new Date(v).toLocaleDateString(),
      },
      {
        title: "Guests",
        dataIndex: "total_guests",
      },
      {
        title: "Total Price",
        dataIndex: "total_price",
        render: (price) => `$${price}`,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (s) => (
          <Tag
            color={
              s === "confirmed"
                ? "green"
                : s === "cancelled"
                ? "red"
                : s === "pending"
                ? "orange"
                : "default"
            }
          >
            {s?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button size="small" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            {record.status === "pending" && (
              <>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleStatusUpdate(record._id, "confirmed")}
                >
                  Confirm
                </Button>
                <Button
                  danger
                  size="small"
                  onClick={() => handleStatusUpdate(record._id, "cancelled")}
                >
                  Cancel
                </Button>
              </>
            )}
            <Popconfirm
              title="Are you sure you want to delete this booking?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="text-xl font-semibold mb-3">Bookings</div>
      <Card>
        <div className="mb-3 flex gap-2 items-center">
          <RangePicker
            onChange={() => {
              /* filter by range (optional) */
            }}
          />
          <Button onClick={load}>Refresh</Button>
        </div>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={data}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Edit Booking"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingRecord(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="confirmed">Confirmed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
