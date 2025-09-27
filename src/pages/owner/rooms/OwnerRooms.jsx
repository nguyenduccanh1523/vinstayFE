import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Image,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
  Select,
  Popconfirm,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { roomApi } from "../../../apis/roomApi";
import { hotelApi } from "../../../apis/hotelApi";
import RoomFormModal from "./RoomFormModal";
import debounce from "lodash.debounce";

const { Search } = Input;

export default function OwnerRooms() {
  const { user } = useSelector((state) => state.auth);
  const ownerId = user?._id || user?.id;

  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState(null);

  const [roomsAll, setRoomsAll] = useState([]); // dữ liệu gốc
  const [rooms, setRooms] = useState([]); // dữ liệu sau filter/search
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // -------- Load Hotels ----------
  const loadHotels = async () => {
    try {
      const res = await hotelApi.getHotelByOwner(ownerId); // nên trả mảng
      const list = Array.isArray(res) ? res : res ? [res] : [];
      setHotels(list);
      setHotelId((prev) => prev || list[0]?._id || null);
    } catch {
      message.error("Failed to load your hotels");
    }
  };

  // -------- Load Rooms ----------
  const loadRooms = async (hid) => {
    if (!hid) {
      setRoomsAll([]);
      setRooms([]);
      return;
    }
    setLoading(true);
    try {
      const data = await roomApi.getRoomsByHotel(hid);
      const arr = Array.isArray(data) ? data : [];
      setRoomsAll(arr);
      setRooms(arr);
    } catch {
      message.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) loadHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  useEffect(() => {
    loadRooms(hotelId);
    // reset search result khi đổi hotel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  // -------- Search (debounce) ----------
  const handleSearch = useMemo(
    () =>
      debounce((val) => {
        const key = (val || "").trim().toLowerCase();
        if (!key) return setRooms(roomsAll);
        setRooms(
          roomsAll.filter(
            (r) =>
              r.room_number?.toLowerCase().includes(key) ||
              r.room_type?.toLowerCase().includes(key)
          )
        );
      }, 300),
    [roomsAll]
  );

  // -------- Table Columns ----------
  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        width: 90,
        render: (images) =>
          images?.length ? (
            <Image
              width={72}
              height={48}
              src={images[0]}
              style={{ objectFit: "cover", borderRadius: 6 }}
              preview={{ mask: "Preview" }}
            />
          ) : (
            <div className="w-[72px] h-[48px] bg-gray-100 rounded grid place-items-center text-xs text-gray-400">
              No Image
            </div>
          ),
      },
      {
        title: "Room",
        dataIndex: "room_number",
        sorter: (a, b) =>
          (a.room_number || "").localeCompare(b.room_number || ""),
        render: (v, rec) => (
          <div className="flex flex-col">
            <span className="font-medium">#{v}</span>
            <span className="text-xs text-gray-500">{rec.room_type}</span>
          </div>
        ),
      },
      {
        title: "Price",
        dataIndex: "price",
        sorter: (a, b) => (a.price || 0) - (b.price || 0),
        render: (v) => (
          <div className="flex items-center gap-1">
            <DollarOutlined className="text-gray-500" />
            <span className="font-medium">{v != null ? v : "—"}</span>
          </div>
        ),
        responsive: ["sm"],
      },
      {
        title: "Area & View",
        dataIndex: "room_area",
        sorter: (a, b) => (a.room_area || 0) - (b.room_area || 0),
        render: (area, record) => (
          <div className="flex flex-col">
            <span className="text-sm">{area ? `${area}m²` : "—"}</span>
            {record.view && (
              <Tag size="small" color="blue">
                {record.view}
              </Tag>
            )}
          </div>
        ),
        responsive: ["md"],
      },
      {
        title: "Capacity",
        dataIndex: "capacity",
        sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
        render: (v) => (
          <div className="flex items-center gap-1">
            <TeamOutlined className="text-gray-500" />
            <span>{v}</span>
          </div>
        ),
        responsive: ["lg"],
      },
      {
        title: "Check Times",
        render: (_, record) => (
          <div className="flex flex-col text-xs">
            <span>In: {record.check_in || "—"}</span>
            <span>Out: {record.check_out || "—"}</span>
          </div>
        ),
        responsive: ["lg"],
      },
      {
        title: "Status",
        dataIndex: "is_available",
        filters: [
          { text: "Available", value: true },
          { text: "Unavailable", value: false },
        ],
        onFilter: (val, rec) => rec.is_available === val,
        render: (v) =>
          v ? (
            <Tag color="green">Available</Tag>
          ) : (
            <Tag color="red">Unavailable</Tag>
          ),
      },
      {
        title: "Actions",
        width: 170,
        render: (_, record) => (
          <Space wrap>
            <Tooltip title="View / Edit">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setEditing(record);
                  setOpen(true);
                }}
              >
                View
              </Button>
            </Tooltip>

            <Popconfirm
              title="Delete this room?"
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                try {
                  await roomApi.deleteRoom(record._id);
                  message.success("Deleted");
                  loadRooms(hotelId);
                } catch {
                  message.error("Delete failed");
                }
              }}
            >
              <Tooltip title="Delete">
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [hotelId]
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="text-xl font-semibold">Rooms</div>
        <div className="flex gap-2 items-center">
          <Select
            style={{ minWidth: 260 }}
            value={hotelId}
            options={hotels.map((h) => ({
              value: h._id,
              label: `${h.name} (${h.city})`,
            }))}
            onChange={(v) => {
              setHotelId(v);
              // reset search kết quả khi đổi hotel
              setRooms(roomsAll);
            }}
            placeholder="Select hotel"
          />
          <Search
            allowClear
            placeholder="Search room # or type…"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 260 }}
            disabled={!roomsAll.length}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={!hotelId}
          >
            Add Room
          </Button>
        </div>
      </div>

      <Card>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={rooms}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 900 }}
          />
        )}
      </Card>

      <RoomFormModal
        open={open}
        onClose={() => setOpen(false)}
        hotels={hotels}
        defaultHotelId={hotelId}
        data={editing}
        onSuccess={() => {
          setOpen(false);
          loadRooms(hotelId);
        }}
      />
    </div>
  );
}
