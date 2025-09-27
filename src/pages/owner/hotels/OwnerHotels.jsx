import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Empty,
  Image,
  message,
  Space,
  Table,
  Tag,
  Input,
  Skeleton,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { hotelApi } from "../../../apis/hotelApi";
import HotelFormModal from "./HotelFormModal";

const { Search } = Input;

export default function OwnerHotels() {
  const { user } = useSelector((state) => state.auth);
  const ownerId = user?._id || user?.id;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await hotelApi.getHotelByOwner(ownerId);
      const hotelsList = Array.isArray(res) ? res : [res];
      console.log("Loaded owner hotels:", hotelsList);
      setHotels(hotelsList.filter((h) => h)); // Filter out null/undefined
    } catch {
      message.error("Failed to load your hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) load();
  }, [ownerId]);

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        width: 100,
        render: (imgs) =>
          imgs?.length ? (
            <Image
              src={imgs[0]}
              width={80}
              height={54}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={{ mask: "Preview" }}
            />
          ) : (
            <div className="w-[80px] h-[54px] bg-gray-100 rounded grid place-items-center text-xs text-gray-400">
              No Image
            </div>
          ),
      },
      { title: "Name", dataIndex: "name" },
      { title: "City", dataIndex: "city" },
      { title: "Country", dataIndex: "country" },
      {
        title: "Amenities",
        dataIndex: "amenities",
        width: 200,
        render: (amenities) => (
          <div className="flex flex-wrap gap-1">
            {amenities && amenities.length > 0 ? (
              amenities.slice(0, 3).map((amenity, index) => (
                <Tag key={index} size="small" color="blue">
                  {amenity}
                </Tag>
              ))
            ) : (
              <span className="text-gray-400">No amenities</span>
            )}
            {amenities && amenities.length > 3 && (
              <Tag size="small" color="default">
                +{amenities.length - 3}
              </Tag>
            )}
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (s) => (
          <Tag color={s === "active" ? "green" : "red"}>{s?.toUpperCase()}</Tag>
        ),
      },
      {
        title: "Action",
        width: 120,
        render: (_, record) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedHotel(record);
                setOpen(true);
              }}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xl font-semibold">Your Hotels</div>
          <div className="text-gray-500 text-sm">
            Create/edit your hotel information
          </div>
        </div>
        <Search
          placeholder="(disabled) search…"
          disabled
          style={{ maxWidth: 300 }}
        />
      </div>

      <Card>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            rowKey="_id"
            dataSource={hotels}
            columns={columns}
            pagination={false}
            locale={{
              emptyText: (
                <Empty description="You don't have any hotels, create one." />
              ),
            }}
          />
        )}
      </Card>

      {hotels.length === 0 && !loading && (
        <div className="mt-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedHotel(null);
              setOpen(true);
            }}
          >
            Create My Hotel
          </Button>
        </div>
      )}

      <HotelFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedHotel(null);
        }}
        data={selectedHotel}
        onSuccess={() => {
          setOpen(false);
          setSelectedHotel(null);
          load();
        }}
      />
    </div>
  );
}
