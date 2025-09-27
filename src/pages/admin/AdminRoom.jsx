import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Image,
  Tag,
  Upload,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { roomApi } from "../../apis/roomApi";
import { hotelApi } from "../../apis/hotelApi";

const { TextArea } = Input;
const { Search } = Input;

// Predefined view options
const VIEW_OPTIONS = [
  "City View",
  "Ocean View",
  "Garden View",
  "Mountain View",
  "Courtyard View",
];

// Predefined room types
const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Suite",
  "Executive",
  "Presidential",
  "Family",
];

const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);

  // guards (anti double-click)
  const [submitting, setSubmitting] = useState(false);
  const [closingEdit, setClosingEdit] = useState(false);
  const [closingView, setClosingView] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [selectedHotelAmenities, setSelectedHotelAmenities] = useState([]);

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!searchText) return setFilteredRooms(rooms);
    const key = searchText.toLowerCase();
    const filtered = rooms.filter((r) => {
      const hotelName =
        typeof r.hotel_id === "object" ? r.hotel_id?.name || "" : "";
      return (
        r.room_number?.toLowerCase().includes(key) ||
        r.room_type?.toLowerCase().includes(key) ||
        hotelName.toLowerCase().includes(key)
      );
    });
    setFilteredRooms(filtered);
  }, [searchText, rooms]);

  const fetchHotels = async () => {
    try {
      const data = await hotelApi.getAllHotels();
      setHotels(data || []);
    } catch {
      message.error("Failed to fetch hotels");
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomApi.getAllRooms();
      setRooms(data || []);
      setFilteredRooms(data || []);
    } catch {
      message.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => setSearchText(value);

  const handleCreate = () => {
    setEditingRoom(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRoom(record);

    // Set selected hotel for amenities
    const hotelId =
      typeof record.hotel_id === "object"
        ? record.hotel_id?._id
        : record.hotel_id;
    setSelectedHotelId(hotelId);

    // Find hotel amenities
    const hotel = hotels.find((h) => h._id === hotelId);
    setSelectedHotelAmenities(hotel?.amenities || []);

    const existingFiles =
      record.images?.map((url, idx) => ({
        uid: `-${idx}`,
        name: `image-${idx}`,
        status: "done",
        url,
        response: { url },
      })) || [];
    setFileList(existingFiles);

    form.setFieldsValue({
      hotel_id: hotelId,
      room_number: record.room_number,
      room_type: record.room_type,
      price: record.price,
      capacity: record.capacity,
      room_area: record.room_area,
      view: record.view,
      check_in_time: record.check_in_time,
      check_out_time: record.check_out_time,
      is_available: record.is_available,
      amenities: record.amenities || [],
      description: record.description || "",
      images: record.images || [],
    });

    setModalVisible(true);
  };

  const handleView = (record) => {
    setViewingRoom(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await roomApi.deleteRoom(id);
      message.success("Room deleted successfully");
      fetchRooms();
    } catch {
      message.error("Failed to delete room");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (values) => {
    if (submitting) return; // guard
    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("hotel_id", values.hotel_id);
      formData.append("room_number", values.room_number);
      formData.append("room_type", values.room_type);
      formData.append("price", values.price);
      formData.append("capacity", values.capacity);
      formData.append("room_area", values.room_area);
      formData.append("view", values.view);
      formData.append("check_in", values.check_in);
      formData.append("check_out", values.check_out);
      formData.append("is_available", values.is_available);

      if (values.description)
        formData.append("description", values.description);

      if (values.amenities && values.amenities.length > 0) {
        formData.append("amenities", JSON.stringify(values.amenities));
      }

      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append(
            "images",
            file.originFileObj,
            file.name || `image-${index}.png`
          );
        } else if (file.url && editingRoom) {
          formData.append("existingImages", file.url);
        }
      });

      if (editingRoom) {
        await roomApi.updateRoom(editingRoom._id, formData);
        message.success("Room updated successfully");
      } else {
        await roomApi.createRoom(formData);
        message.success("Room created successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setSelectedHotelId(null);
      setSelectedHotelAmenities([]);
      fetchRooms();
    } catch {
      message.error(`Failed to ${editingRoom ? "update" : "create"} room`);
    } finally {
      setSubmitting(false);
    }
  };

  // close handlers with guard (avoid double-click)
  const handleCloseEditModal = () => {
    if (submitting || closingEdit) return;
    setClosingEdit(true);
    setModalVisible(false);
    setTimeout(() => {
      setFileList([]);
      setSelectedHotelId(null);
      setSelectedHotelAmenities([]);
      setClosingEdit(false);
    }, 200);
  };

  const handleCloseViewModal = () => {
    if (closingView) return;
    setClosingView(true);
    setViewModalVisible(false);
    setTimeout(() => setClosingView(false), 200);
  };

  // Upload preview only
  const handleUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess({ url: URL.createObjectURL(file) });
    }, 100);
  };

  const handleFileChange = ({ fileList: newList }) => {
    setFileList(newList);
    const urls = newList
      .filter((f) => f.status === "done")
      .map((f) => f.response?.url || f.url)
      .filter(Boolean);
    form.setFieldValue("images", urls);
  };

  const handleRemoveFile = (file) => {
    const newList = fileList.filter((i) => i.uid !== file.uid);
    setFileList(newList);
  };

  const handleHotelChange = (hotelId) => {
    setSelectedHotelId(hotelId);
    const hotel = hotels.find((h) => h._id === hotelId);
    setSelectedHotelAmenities(hotel?.amenities || []);
    // Clear amenities when hotel changes
    form.setFieldValue("amenities", []);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: 80,
      render: (images) =>
        images?.length ? (
          <Image
            width={60}
            height={40}
            src={images[0]}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        ),
    },
    {
      title: "Room #",
      dataIndex: "room_number",
      key: "room_number",
      sorter: (a, b) =>
        (a.room_number || "").localeCompare(b.room_number || ""),
    },
    {
      title: "Type",
      dataIndex: "room_type",
      key: "room_type",
      sorter: (a, b) => (a.room_type || "").localeCompare(b.room_type || ""),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      render: (v) => (v != null ? `$${v}` : "—"),
    },
    {
      title: "Area",
      dataIndex: "room_area",
      key: "room_area",
      sorter: (a, b) => (a.room_area || 0) - (b.room_area || 0),
      render: (v) => (v != null ? `${v}m²` : "—"),
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (view) => (view ? <Tag color="blue">{view}</Tag> : "—"),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0),
    },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      render: (val) => (
        <Tag color={val ? "green" : "red"}>
          {val ? "Available" : "Unavailable"}
        </Tag>
      ),
      filters: [
        { text: "Available", value: true },
        { text: "Unavailable", value: false },
      ],
      onFilter: (value, record) => record.is_available === value,
    },
    {
      title: "Hotel",
      dataIndex: "hotel_id",
      key: "hotel",
      render: (h) =>
        typeof h === "object" ? `${h?.name || "—"} (${h?.city || ""})` : "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={deletingId === record._id}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deletingId === record._id}
              disabled={deletingId === record._id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Search by room #, type, or hotel..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 340 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Room
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1000 }}
      />

      {/* Create / Edit */}
      <Modal
        title={editingRoom ? "Edit Room" : "Create Room"}
        open={modalVisible}
        onCancel={handleCloseEditModal}
        footer={null}
        width={900}
        maskClosable={false}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="hotel_id"
            label="Hotel"
            rules={[{ required: true, message: "Please select hotel!" }]}
          >
            <Select
              placeholder="Select a hotel"
              showSearch
              optionFilterProp="label"
              onChange={handleHotelChange}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={hotels.map((h) => ({
                value: h._id,
                label: `${h.name} (${h.city})`,
              }))}
              disabled={submitting}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="room_number"
              label="Room Number"
              rules={[{ required: true, message: "Please input room number!" }]}
            >
              <Input disabled={submitting} />
            </Form.Item>

            <Form.Item
              name="room_type"
              label="Room Type"
              rules={[{ required: true, message: "Please select room type!" }]}
            >
              <Select placeholder="Select room type" disabled={submitting}>
                {ROOM_TYPES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="price"
              label="Price (USD)"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type="number" step="any" min={0} disabled={submitting} />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true, message: "Please input capacity!" }]}
            >
              <Input type="number" min={1} disabled={submitting} />
            </Form.Item>

            <Form.Item
              name="room_area"
              label="Room Area (m²)"
              rules={[{ required: true, message: "Please input room area!" }]}
            >
              <Input type="number" min={1} disabled={submitting} />
            </Form.Item>
          </div>

          <Form.Item
            name="view"
            label="View"
            rules={[{ required: true, message: "Please select view!" }]}
          >
            <Select placeholder="Select room view" disabled={submitting}>
              {VIEW_OPTIONS.map((view) => (
                <Select.Option key={view} value={view}>
                  {view}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="check_in"
              label="Check-in Time"
              rules={[
                { required: true, message: "Please input check-in time!" },
              ]}
            >
              <Input placeholder="14:00" disabled={submitting} />
            </Form.Item>

            <Form.Item
              name="check_out"
              label="Check-out Time"
              rules={[
                { required: true, message: "Please input check-out time!" },
              ]}
            >
              <Input placeholder="12:00" disabled={submitting} />
            </Form.Item>
          </div>

          <Form.Item
            name="is_available"
            label="Availability"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Available"
              unCheckedChildren="Unavailable"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item name="amenities" label="Amenities">
            <Select
              mode="multiple"
              placeholder={
                selectedHotelId
                  ? "Select amenities from hotel"
                  : "Please select a hotel first"
              }
              disabled={
                submitting ||
                !selectedHotelId ||
                selectedHotelAmenities.length === 0
              }
            >
              {selectedHotelAmenities.map((amenity) => (
                <Select.Option key={amenity} value={amenity}>
                  {amenity}
                </Select.Option>
              ))}
            </Select>
            {!selectedHotelId && (
              <div className="text-gray-500 text-sm mt-1">
                Select a hotel first to see available amenities
              </div>
            )}
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} disabled={submitting} />
          </Form.Item>

          <Form.Item name="images" label="Room Images">
            <Upload
              customRequest={handleUpload}
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              listType="picture-card"
              multiple
              accept="image/*"
              disabled={submitting}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) message.error("You can only upload image files!");
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) message.error("Image must be smaller than 5MB!");
                return isImage && isLt5M;
              }}
            >
              {fileList.length >= 8 || submitting ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div className="text-gray-500 text-sm mt-2">
              You can upload up to 8 images. Supported formats: JPG, PNG, GIF.
              Max size: 5MB each.
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingRoom ? "Update" : "Create"}
              </Button>
              <Button
                onClick={handleCloseEditModal}
                disabled={submitting || closingEdit}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View */}
      <Modal
        title="Room Details"
        open={viewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseViewModal}
            disabled={closingView}
          >
            Close
          </Button>,
        ]}
        width={800}
        maskClosable={false}
        destroyOnClose
      >
        {viewingRoom && (
          <div className="space-y-4">
            {viewingRoom.images?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Images:</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingRoom.images.map((img, idx) => (
                    <Image
                      key={idx}
                      width={100}
                      height={80}
                      src={img}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Hotel:</strong>{" "}
                {typeof viewingRoom.hotel_id === "object"
                  ? `${viewingRoom.hotel_id?.name} (${viewingRoom.hotel_id?.city})`
                  : viewingRoom.hotel_id}
              </div>
              <div>
                <strong>Room #:</strong> {viewingRoom.room_number}
              </div>
              <div>
                <strong>Type:</strong> {viewingRoom.room_type}
              </div>
              <div>
                <strong>Price:</strong> ${viewingRoom.price}
              </div>
              <div>
                <strong>Capacity:</strong> {viewingRoom.capacity}
              </div>
              <div>
                <strong>Area:</strong> {viewingRoom.room_area}m²
              </div>
              <div>
                <strong>View:</strong> {viewingRoom.view || "—"}
              </div>
              <div>
                <strong>Available:</strong>{" "}
                {viewingRoom.is_available ? "Yes" : "No"}
              </div>
              <div>
                <strong>Check-in:</strong> {viewingRoom.check_in || "—"}
              </div>
              <div>
                <strong>Check-out:</strong> {viewingRoom.check_out || "—"}
              </div>
            </div>

            {viewingRoom.amenities?.length ? (
              <div>
                <strong>Amenities:</strong>
                <div className="flex flex-wrap gap-1 mt-2">
                  {viewingRoom.amenities.map((amenity, index) => (
                    <Tag key={index} color="blue">
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {viewingRoom.description ? (
              <div>
                <strong>Description:</strong> {viewingRoom.description}
              </div>
            ) : null}

            <div className="text-gray-500 text-sm">
              <div>
                <strong>Created:</strong>{" "}
                {new Date(viewingRoom.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Updated:</strong>{" "}
                {new Date(viewingRoom.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminRoom;
