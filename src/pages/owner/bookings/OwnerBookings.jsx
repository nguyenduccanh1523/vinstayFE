// src/pages/owner/bookings/OwnerBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
// import { bookingApi } from "@/apis/bookingApi";
import { Card, DatePicker, Table, Tag } from "antd";
const { RangePicker } = DatePicker;

export default function OwnerBookings() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // const res = await bookingApi.getBookingsByHotelOwner(ownerId);
      // setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (ownerId) load(); }, [ownerId]);

  const columns = useMemo(() => [
    { title: "Code", dataIndex: "code" },
    { title: "Room", dataIndex: ["room_id","room_number"], render: (v, rec) => `#${v} (${rec.room_id?.room_type})` },
    { title: "Customer", dataIndex: ["customer_id","email"] },
    { title: "Check-in", dataIndex: "check_in", render: v => new Date(v).toLocaleDateString() },
    { title: "Check-out", dataIndex: "check_out", render: v => new Date(v).toLocaleDateString() },
    { title: "Total", dataIndex: "total_price" },
    { title: "Status", dataIndex: "status", render: s => <Tag color={s === "paid" ? "green" : "orange"}>{s?.toUpperCase()}</Tag> },
  ], []);

  return (
    <div>
      <div className="text-xl font-semibold mb-3">Bookings</div>
      <Card>
        <div className="mb-3 flex gap-2 items-center">
          <RangePicker onChange={() => {/* filter by range (optional) */}} />
        </div>
        <Table rowKey="_id" loading={loading} columns={columns} dataSource={data} />
      </Card>
    </div>
  );
}
