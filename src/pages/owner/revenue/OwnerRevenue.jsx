// src/pages/owner/revenue/OwnerRevenue.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
// import { ownerApi } from "/apis/ownerApi";
import { Card, Col, Row, Statistic, DatePicker, Table } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function OwnerRevenue() {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, count: 0, avg: 0 });
  const [topRooms, setTopRooms] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      // API gợi ý: /owners/:id/revenue?from=&to=
      // const res = await ownerApi.getRevenueSummary(ownerId);
      // setSummary(res?.summary || { total: 0, count: 0, avg: 0 });
      // setTopRooms(res?.topRooms || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (ownerId) load(); }, [ownerId]);

  const columns = useMemo(() => [
    { title: "Room", dataIndex: "room_number" },
    { title: "Type", dataIndex: "room_type" },
    { title: "Bookings", dataIndex: "orders" },
    { title: "Revenue", dataIndex: "revenue" },
  ], []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-semibold">Revenue</div>
        <RangePicker onChange={() => {/* pass to API */}} />
      </div>

      <Row gutter={[16,16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Total Revenue" prefix={<DollarOutlined />} value={summary.total} precision={2} />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic title="Total Bookings" value={summary.count} />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic title="Avg per Booking" prefix={<DollarOutlined />} value={summary.avg} precision={2} />
          </Card>
        </Col>
      </Row>

      <Card className="mt-3" title="Top Rooms">
        <Table rowKey="room_id" columns={columns} dataSource={topRooms} loading={loading} pagination={false} />
      </Card>
    </div>
  );
}
