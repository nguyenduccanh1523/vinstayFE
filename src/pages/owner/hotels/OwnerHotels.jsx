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

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // modal open

  const load = async () => {
    setLoading(true);
    try {
      const res = await hotelApi.getHotelByOwner(ownerId);
      const h = Array.isArray(res) ? res[0] : res;
      setHotel(h || null);
    } catch {
      message.error("Failed to load your hotel");
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
        title: "Status",
        dataIndex: "status",
        render: (s) => (
          <Tag color={s === "active" ? "green" : "red"}>
            {s?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Action",
        width: 120,
        render: () =>
          hotel ? (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => setOpen(true)}>
                Edit
              </Button>
            </Space>
          ) : null,
      },
    ],
    [hotel]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xl font-semibold">Your Hotel</div>
          <div className="text-gray-500 text-sm">
            Tạo / chỉnh sửa thông tin khách sạn của bạn
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
            dataSource={hotel ? [hotel] : []}
            columns={columns}
            pagination={false}
            locale={{
              emptyText: (
                <Empty description="You don't have a hotel, create one." />
              ),
            }}
          />
        )}
      </Card>

      {!hotel && !loading && (
        <div className="mt-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Create My Hotel
          </Button>
        </div>
      )}

      <HotelFormModal
        open={open}
        onClose={() => setOpen(false)}
        data={hotel}
        onSuccess={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}
