import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { hotelApi } from "../../apis/hotelApi";
import { customerApi } from "../../apis/customerApi"; // <-- added import for owners

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

// Predefined amenities list
const AMENITIES_LIST = [
  "Wifi",
  "Kitchen",
  "Jacuzzi",
  "Balcony",
  "TV",
  "AC",
  "Safe",
  "Spa",
  "Pool",
  "Parking",
  "Restaurant",
  "Gym",
  "Beach",
  "Bar",
  "Bida",
];

// Predefined cities list
const CITIES_LIST = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Sapa",
  "Hội An",
  "Nha Trang",
];

const AdminHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [viewingHotel, setViewingHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [owners, setOwners] = useState([]); // <-- new: owners list
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHotels();
    fetchOwners(); // <-- fetch owners on mount
  }, []);

  useEffect(() => {
    // Filter hotels based on search text
    if (searchText) {
      const filtered = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  }, [searchText, hotels]);

  // helper: safely parse a field that may be array or JSON-string
  const ensureArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
      } catch (e) {
        // fallback: split by comma (if stored as csv)
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const fetchOwners = async () => {
    try {
      const data = await customerApi.getAllCustomers();
      // Optionally filter owners by role if you have role info, otherwise keep all users
      setOwners(data || []);
    } catch (error) {
      // silent or show message
      console.error("Failed to fetch owners", error);
    }
  };

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await hotelApi.getAllHotels();
      // normalize amenities and images to arrays for consistent usage in UI
      const normalized = (data || []).map((h) => ({
        ...h,
        amenities: ensureArray(h.amenities),
        images: ensureArray(h.images),
      }));
      setHotels(normalized);
      setFilteredHotels(normalized);
    } catch (error) {
      message.error("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleCreate = () => {
    setEditingHotel(null);
    form.resetFields();
    form.setFieldsValue({ country: "VietNam", owner_id: undefined }); // include owner default
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingHotel(record);

    // Prepare existing files (images) safely
    const imagesArr = ensureArray(record.images);
    const existingFiles =
      imagesArr.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: "done",
        url: url,
        response: { url: url },
      })) || [];
    setFileList(existingFiles);

    form.setFieldsValue({
      name: record.name,
      description: record.description,
      address: record.address,
      city: record.city,
      country: record.country || "VietNam",
      latitude: record.latitude,
      longitude: record.longitude,
      status: record.status,
      amenities: ensureArray(record.amenities), // <-- ensure amenities is array
      images: imagesArr,
      owner_id: record.owner_id?._id || record.owner_id || undefined, // ensure owner id for select
    });

    setModalVisible(true);
  };

  const handleView = (record) => {
    setViewingHotel(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await hotelApi.deleteHotel(id);
      message.success("Hotel deleted successfully");
      fetchHotels();
    } catch (error) {
      message.error("Failed to delete hotel");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Add text fields to FormData
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("city", values.city);
      formData.append("country", values.country);
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);
      formData.append("status", values.status);

      // Add owner if provided
      if (values.owner_id) {
        formData.append("owner_id", values.owner_id);
      }

      // Add amenities as multiple form entries (avoid JSON-string)
      if (values.amenities && values.amenities.length > 0) {
        values.amenities.forEach((amen) => formData.append("amenities", amen));
      }

      // Add files to FormData
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          // New files to upload
          formData.append(
            "images",
            file.originFileObj,
            file.name || `image-${index}.png`
          );
        } else if (file.url && editingHotel) {
          // Existing files (for update operations) - keep previous key name as backend expects
          formData.append("existingImages", file.url);
        }
      });

      if (editingHotel) {
        await hotelApi.updateHotel(editingHotel._id, formData);
        message.success("Hotel updated successfully");
      } else {
        await hotelApi.createHotel(formData);
        message.success("Hotel created successfully");
      }
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchHotels();
    } catch (error) {
      message.error(`Failed to ${editingHotel ? "update" : "create"} hotel`);
    }
  };

  // Handle image upload - Store files locally without uploading
  const handleUpload = ({ file, onSuccess, onError }) => {
    // Just mark as done without actual upload
    setTimeout(() => {
      onSuccess({ url: URL.createObjectURL(file) });
    }, 100);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Update form field with current image URLs
    const imageUrls = newFileList
      .filter((file) => file.status === "done")
      .map((file) => file.response?.url || file.url)
      .filter(Boolean);

    form.setFieldValue("images", imageUrls);
  };

  const handleRemoveFile = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: 80,
      render: (images) =>
        images && images.length > 0 ? (
          <Image
            width={60}
            height={40}
            src={images[0]}
            style={{ objectFit: "cover", borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Amenities",
      dataIndex: "amenities",
      key: "amenities",
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
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (rating ? `${rating}⭐` : "Not rated"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner_id",
      key: "owner",
      render: (owner) => owner?.username || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
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
            title="Are you sure to delete this hotel?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotel Management</h1>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Search hotels by name..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Hotel
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredHotels}
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

      {/* Create/Edit Modal */}
      <Modal
        title={editingHotel ? "Edit Hotel" : "Create Hotel"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFileList([]);
        }}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Hotel Name"
            rules={[{ required: true, message: "Please input hotel name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="images" label="Hotel Images">
            <Upload
              customRequest={handleUpload}
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              listType="picture-card"
              multiple
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Image must be smaller than 5MB!");
                }
                return isImage && isLt5M;
              }}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div className="text-gray-500 text-sm mt-2">
              You can upload up to 8 images. Supported formats: JPG, PNG, GIF.
              Max size: 5MB per image.
            </div>
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please select city!" }]}
            >
              <Select placeholder="Select a city">
                {CITIES_LIST.map((city) => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please input country!" }]}
            >
              <Input defaultValue="VietNam" readOnly />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: "Please input latitude!" }]}
            >
              <Input type="number" step="any" />
            </Form.Item>

            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true, message: "Please input longitude!" }]}
            >
              <Input type="number" step="any" />
            </Form.Item>
          </div>

          {/* Owner select - new */}
          <Form.Item name="owner_id" label="Owner">
            <Select placeholder="Select owner" allowClear>
              {owners.map((o) => (
                <Select.Option
                  key={o._id || o.id || o.email}
                  value={o._id || o.id || o.email}
                >
                  {o.username ? `${o.username} (${o.email || ""})` : o.email}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Amenities checkbox group (unchanged UI) */}
          <Form.Item name="amenities" label="Amenities">
            <Checkbox.Group>
              <div className="grid grid-cols-3 gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <Checkbox key={amenity} value={amenity}>
                    {amenity}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHotel ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setFileList([]);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Hotel Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewingHotel && (
          <div className="space-y-4">
            {viewingHotel.images && viewingHotel.images.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Images:</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingHotel.images.map((img, index) => (
                    <Image
                      key={index}
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
                <strong>Name:</strong> {viewingHotel.name}
              </div>
              <div>
                <strong>City:</strong> {viewingHotel.city}
              </div>
              <div>
                <strong>Country:</strong> {viewingHotel.country}
              </div>
              <div>
                <strong>Rating:</strong> {viewingHotel.rating || "Not rated"}
              </div>
            </div>

            <div>
              <strong>Address:</strong> {viewingHotel.address}
            </div>
            <div>
              <strong>Description:</strong> {viewingHotel.description}
            </div>

            {viewingHotel.amenities && viewingHotel.amenities.length > 0 && (
              <div>
                <strong>Amenities:</strong>
                <div className="flex flex-wrap gap-1 mt-2">
                  {viewingHotel.amenities.map((amenity, index) => (
                    <Tag key={index} color="blue">
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div>
              <strong>Owner:</strong> {viewingHotel.owner_id?.username} (
              {viewingHotel.owner_id?.email})
            </div>
            <div>
              <strong>Coordinates:</strong> {viewingHotel.latitude},{" "}
              {viewingHotel.longitude}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminHotel;
