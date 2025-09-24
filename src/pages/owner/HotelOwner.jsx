import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Image,
  Tag,
  Upload,
  Switch,
  Divider,
  Empty,
  Card,
  Skeleton,
  Row,
  Col,
  Statistic,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  HomeOutlined,
  DollarOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { hotelApi } from "../../apis/hotelApi";
import { roomApi } from "../../apis/roomApi";

const { TextArea } = Input;

const HotelOwner = () => {
  const { user } = useSelector((s) => s.auth);
  const ownerId = user?._id || user?.id;

  // Hotel state
  const [ownerHotel, setOwnerHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [hotelEditing, setHotelEditing] = useState(false);
  const [hotelFileList, setHotelFileList] = useState([]);
  const [hotelForm] = Form.useForm();

  // Room state
  const [rooms, setRooms] = useState([]);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomEditing, setRoomEditing] = useState(null);
  const [roomFileList, setRoomFileList] = useState([]);
  const [roomForm] = Form.useForm();

  // ====== FETCH ======
  useEffect(() => {
    if (!ownerId) return;
    fetchOwnerHotel();
  }, [ownerId]);

  useEffect(() => {
    if (ownerHotel?._id) {
      fetchRooms(ownerHotel._id);
    } else {
      setRooms([]);
    }
  }, [ownerHotel?._id]);

  const fetchOwnerHotel = async () => {
    setHotelLoading(true);
    try {
      const data = await hotelApi.getHotelByOwner(ownerId);
      // backend có thể trả 1 hotel hoặc mảng
      const hotel =
        Array.isArray(data) ? (data.length ? data[0] : null) : data || null;
      setOwnerHotel(hotel);

      // Chuẩn bị fileList cho edit
      if (hotel?.images?.length) {
        const files = hotel.images.map((url, idx) => ({
          uid: `h-${idx}`,
          name: `image-${idx}`,
          status: "done",
          url,
          response: { url },
        }));
        setHotelFileList(files);
      } else {
        setHotelFileList([]);
      }
    } catch (e) {
      message.error("Failed to fetch your hotel");
    } finally {
      setHotelLoading(false);
    }
  };

  const fetchRooms = async (hotelId) => {
    setRoomLoading(true);
    try {
      const data = await roomApi.getRoomsByHotel(hotelId);
      setRooms(data || []);
    } catch (e) {
      message.error("Failed to fetch rooms");
    } finally {
      setRoomLoading(false);
    }
  };

  // ====== HOTEL: CREATE / EDIT ======
  const openCreateHotel = () => {
    setHotelEditing(false);
    hotelForm.resetFields();
    setHotelFileList([]);
    setHotelModalOpen(true);
  };

  const openEditHotel = () => {
    if (!ownerHotel) return;
    setHotelEditing(true);

    hotelForm.setFieldsValue({
      name: ownerHotel.name,
      description: ownerHotel.description,
      address: ownerHotel.address,
      city: ownerHotel.city,
      country: ownerHotel.country,
      latitude: ownerHotel.latitude,
      longitude: ownerHotel.longitude,
      check_in_time: ownerHotel.check_in_time,
      check_out_time: ownerHotel.check_out_time,
      status: ownerHotel.status,
      images: ownerHotel.images || [],
    });

    const existingFiles =
      ownerHotel.images?.map((url, index) => ({
        uid: `h-${index}`,
        name: `image-${index}`,
        status: "done",
        url,
        response: { url },
      })) || [];
    setHotelFileList(existingFiles);

    setHotelModalOpen(true);
  };

  const submitHotel = async (values) => {
    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("description", values.description);
      fd.append("address", values.address);
      fd.append("city", values.city);
      fd.append("country", values.country);
      fd.append("latitude", values.latitude);
      fd.append("longitude", values.longitude);
      fd.append("check_in_time", values.check_in_time);
      fd.append("check_out_time", values.check_out_time);
      fd.append("status", values.status);

      // images
      hotelFileList.forEach((file, idx) => {
        if (file.originFileObj) {
          fd.append("images", file.originFileObj, file.name || `image-${idx}.png`);
        } else if (file.url && hotelEditing) {
          fd.append("existingImages", file.url);
        }
      });

      if (hotelEditing && ownerHotel?._id) {
        await hotelApi.updateHotel(ownerHotel._id, fd);
        message.success("Hotel updated");
      } else {
        await hotelApi.createHotel(fd);
        message.success("Hotel created");
      }
      setHotelModalOpen(false);
      await fetchOwnerHotel();
    } catch (e) {
      message.error(`Failed to ${hotelEditing ? "update" : "create"} hotel`);
    }
  };

  // ====== HOTEL: upload helpers ======
  const hotelUpload = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess({ url: URL.createObjectURL(file) }), 100);

  const onHotelFilesChange = ({ fileList }) => setHotelFileList(fileList);
  const onHotelFileRemove = (file) =>
    setHotelFileList((prev) => prev.filter((f) => f.uid !== file.uid));

  // ====== ROOM: CREATE / EDIT / DELETE ======
  const openCreateRoom = () => {
    if (!ownerHotel?._id) return message.warning("Please create your hotel first.");
    setRoomEditing(null);
    roomForm.resetFields();
    setRoomFileList([]);
    setRoomModalOpen(true);
  };

  const openEditRoom = (record) => {
    setRoomEditing(record);
    roomForm.setFieldsValue({
      room_number: record.room_number,
      room_type: record.room_type,
      price: record.price,
      capacity: record.capacity,
      is_available: record.is_available,
      amenities: record.amenities || [],
      description: record.description || "",
      images: record.images || [],
    });
    const files =
      record.images?.map((url, idx) => ({
        uid: `r-${idx}`,
        name: `image-${idx}`,
        status: "done",
        url,
        response: { url },
      })) || [];
    setRoomFileList(files);
    setRoomModalOpen(true);
  };

  const submitRoom = async (values) => {
    try {
      const fd = new FormData();
      fd.append("hotel_id", ownerHotel._id); // gắn hotel owner luôn
      fd.append("room_number", values.room_number);
      fd.append("room_type", values.room_type);
      fd.append("price", values.price);
      fd.append("capacity", values.capacity);
      fd.append("is_available", values.is_available);

      if (values.description) fd.append("description", values.description);
      (values.amenities || []).forEach((a) => fd.append("amenities", a));

      roomFileList.forEach((file, idx) => {
        if (file.originFileObj) {
          fd.append("images", file.originFileObj, file.name || `image-${idx}.png`);
        } else if (file.url && roomEditing) {
          fd.append("existingImages", file.url);
        }
      });

      if (roomEditing?._id) {
        await roomApi.updateRoom(roomEditing._id, fd);
        message.success("Room updated");
      } else {
        await roomApi.createRoom(fd);
        message.success("Room created");
      }
      setRoomModalOpen(false);
      fetchRooms(ownerHotel._id);
    } catch (e) {
      message.error(`Failed to ${roomEditing ? "update" : "create"} room`);
    }
  };

  const deleteRoom = async (id) => {
    try {
      await roomApi.deleteRoom(id);
      message.success("Room deleted");
      fetchRooms(ownerHotel._id);
    } catch (e) {
      message.error("Failed to delete room");
    }
  };

  // ====== ROOM: upload helpers ======
  const roomUpload = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess({ url: URL.createObjectURL(file) }), 100);

  const onRoomFilesChange = ({ fileList }) => setRoomFileList(fileList);
  const onRoomFileRemove = (file) =>
    setRoomFileList((prev) => prev.filter((f) => f.uid !== file.uid));

  // ====== STATS (UX) ======
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.is_available).length;
    const avgPrice =
      total > 0
        ? Math.round(
            (rooms.reduce((sum, r) => sum + (Number(r.price) || 0), 0) / total) *
              100
          ) / 100
        : 0;
    return { total, available, avgPrice };
  }, [rooms]);

  // ====== COLUMNS ======
  const roomColumns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        key: "images",
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
        key: "room_number",
        sorter: (a, b) => (a.room_number || "").localeCompare(b.room_number || ""),
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
        key: "price",
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
        title: "Capacity",
        dataIndex: "capacity",
        key: "capacity",
        sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
        render: (v) => (
          <div className="flex items-center gap-1">
            <TeamOutlined className="text-gray-500" />
            <span>{v}</span>
          </div>
        ),
        responsive: ["md"],
      },
      {
        title: "Status",
        dataIndex: "is_available",
        key: "is_available",
        render: (v) =>
          v ? (
            <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="success">
              Available
            </Tag>
          ) : (
            <Tag icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />} color="error">
              Unavailable
            </Tag>
          ),
        filters: [
          { text: "Available", value: true },
          { text: "Unavailable", value: false },
        ],
        onFilter: (val, rec) => rec.is_available === val,
      },
      {
        title: "Actions",
        key: "actions",
        width: 170,
        render: (_, record) => (
          <Space size="small" wrap>
            <Tooltip title="View / Edit">
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => openEditRoom(record)}
              >
                View
              </Button>
            </Tooltip>
            <Tooltip title="Delete room">
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => deleteRoom(record._id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-[1200px] mx-auto px-3 md:px-6 py-4 md:py-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <HomeOutlined />
            My Hotel
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý khách sạn và phòng của bạn nhanh chóng, trực quan.
          </p>
        </div>

        <div className="flex gap-8">
          <Statistic title="Rooms" value={stats.total} />
          <Statistic title="Available" value={stats.available} />
          <Statistic
            title="Avg. Price"
            prefix="$"
            value={stats.avgPrice}
            precision={2}
          />
        </div>
      </div>

      {/* HOTEL SECTION */}
      {hotelLoading ? (
        <Card className="mb-6" variant="bordered">
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        </Card>
      ) : ownerHotel ? (
        <Card
          className="mb-6"
          variant="bordered"
          title={
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <ApartmentOutlined />
                <span className="font-semibold">{ownerHotel.name}</span>
                <Tag color={ownerHotel.status === "active" ? "green" : "red"}>
                  {ownerHotel.status?.toUpperCase()}
                </Tag>
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1">
                <EnvironmentOutlined />
                {ownerHotel.address}, {ownerHotel.city}, {ownerHotel.country}
              </div>
            </div>
          }
          extra={
            <Button type="primary" icon={<EditOutlined />} onClick={openEditHotel}>
              Edit Hotel
            </Button>
          }
        >
          {ownerHotel.images?.length ? (
            <Row gutter={[12, 12]}>
              {ownerHotel.images.map((img, i) => (
                <Col key={i} xs={12} sm={8} md={6} lg={6}>
                  <Image
                    src={img}
                    height={120}
                    width="100%"
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No images yet" />
          )}
          {ownerHotel.description && (
            <div className="text-sm text-gray-600 mt-3">{ownerHotel.description}</div>
          )}
        </Card>
      ) : (
        <Card className="mb-6" variant="bordered">
          <div className="flex flex-col items-center text-center py-6">
            <Empty
              description={
                <div>
                  <div className="font-medium">You don't have a hotel yet</div>
                  <div className="text-gray-500">
                    Tạo khách sạn để bắt đầu quản lý phòng.
                  </div>
                </div>
              }
            />
            <Button
              type="primary"
              size="large"
              className="mt-3"
              icon={<PlusOutlined />}
              onClick={openCreateHotel}
            >
              Create My Hotel
            </Button>
          </div>
        </Card>
      )}

      {/* ROOMS SECTION */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-semibold">Rooms</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateRoom}
          disabled={!ownerHotel?._id}
        >
          Add Room
        </Button>
      </div>

      <Card variant="bordered">
        <Table
          columns={roomColumns}
          dataSource={rooms}
          rowKey="_id"
          loading={roomLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* HOTEL MODAL */}
      <Modal
        title={hotelEditing ? "Edit Hotel" : "Create Hotel"}
        open={hotelModalOpen}
        onCancel={() => {
          setHotelModalOpen(false);
          setHotelFileList([]);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Form form={hotelForm} layout="vertical" onFinish={submitHotel}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Hotel Name"
                rules={[{ required: true, message: "Please input hotel name!" }]}
              >
                <Input placeholder="e.g. VinnStay Riverside" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status!" }]}
              >
                <Select
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  placeholder="Select status"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={3} placeholder="Short description about your hotel..." />
          </Form.Item>

          <Form.Item name="images" label="Hotel Images">
            <Upload
              customRequest={hotelUpload}
              listType="picture-card"
              fileList={hotelFileList}
              onChange={onHotelFilesChange}
              onRemove={onHotelFileRemove}
              multiple
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) message.error("Only image files are allowed!");
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) message.error("Image must be smaller than 5MB!");
                return isImage && isLt5M;
              }}
            >
              {hotelFileList.length >= 8 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div className="text-gray-500 text-sm mt-2">
              Up to 8 images. JPG/PNG/GIF. Max 5MB each.
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input address!" }]}
              >
                <Input placeholder="123 Main St" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please input city!" }]}
              >
                <Input placeholder="Da Nang" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: "Please input country!" }]}
              >
                <Input placeholder="Vietnam" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="check_in_time"
                label="Check-in Time"
                rules={[{ required: true, message: "Please input check-in time!" }]}
              >
                <Input placeholder="14:00" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="check_out_time"
                label="Check-out Time"
                rules={[{ required: true, message: "Please input check-out time!" }]}
              >
                <Input placeholder="12:00" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[{ required: true, message: "Please input latitude!" }]}
              >
                <Input type="number" step="any" placeholder="16.0471" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[{ required: true, message: "Please input longitude!" }]}
              >
                <Input type="number" step="any" placeholder="108.2068" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {hotelEditing ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setHotelModalOpen(false);
                  setHotelFileList([]);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ROOM MODAL */}
      <Modal
        title={roomEditing ? "Edit Room" : "Create Room"}
        open={roomModalOpen}
        onCancel={() => {
          setRoomModalOpen(false);
          setRoomFileList([]);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form form={roomForm} layout="vertical" onFinish={submitRoom}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="room_number"
                label="Room Number"
                rules={[{ required: true, message: "Please input room number!" }]}
              >
                <Input placeholder="101" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="room_type"
                label="Room Type"
                rules={[{ required: true, message: "Please input room type!" }]}
              >
                <Input placeholder="Deluxe / Suite / ..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="Price (USD)"
                rules={[{ required: true, message: "Please input price!" }]}
              >
                <Input type="number" step="any" min={0} placeholder="120" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[{ required: true, message: "Please input capacity!" }]}
              >
                <Input type="number" min={1} placeholder="2" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="is_available"
            label="Availability"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Available" unCheckedChildren="Unavailable" />
          </Form.Item>

          <Form.Item name="amenities" label="Amenities">
            <Select mode="tags" placeholder="WiFi, TV, Mini-bar..." />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Room description..." />
          </Form.Item>

          <Form.Item name="images" label="Room Images">
            <Upload
              customRequest={roomUpload}
              listType="picture-card"
              fileList={roomFileList}
              onChange={onRoomFilesChange}
              onRemove={onRoomFileRemove}
              multiple
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) message.error("Only image files are allowed!");
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) message.error("Image must be smaller than 5MB!");
                return isImage && isLt5M;
              }}
            >
              {roomFileList.length >= 8 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div className="text-gray-500 text-sm mt-2">
              Up to 8 images. JPG/PNG/GIF. Max 5MB each.
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {roomEditing ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setRoomModalOpen(false);
                  setRoomFileList([]);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelOwner;
