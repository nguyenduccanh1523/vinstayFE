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

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

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
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHotels();
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

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await hotelApi.getAllHotels();
      setHotels(data);
      setFilteredHotels(data);
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
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingHotel(record);

    // Set existing images to fileList
    const existingFiles =
      record.images?.map((url, index) => ({
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
      country: record.country,
      latitude: record.latitude,
      longitude: record.longitude,
      check_in_time: record.check_in_time,
      check_out_time: record.check_out_time,
      status: record.status,
      images: record.images || [], // Add images to form values
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
      formData.append("check_in_time", values.check_in_time);
      formData.append("check_out_time", values.check_out_time);
      formData.append("status", values.status);

      // Add files to FormData
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          // New files to upload
          formData.append("images", file.originFileObj, file.name || `image-${index}.png`);
        } else if (file.url && editingHotel) {
          // Existing files (for update operations)
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
              rules={[{ required: true, message: "Please input city!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please input country!" }]}
            >
              <Input />
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

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="check_in_time"
              label="Check-in Time"
              rules={[
                { required: true, message: "Please input check-in time!" },
              ]}
            >
              <Input placeholder="14:00" />
            </Form.Item>

            <Form.Item
              name="check_out_time"
              label="Check-out Time"
              rules={[
                { required: true, message: "Please input check-out time!" },
              ]}
            >
              <Input placeholder="12:00" />
            </Form.Item>
          </div>

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
              <div>
                <strong>Check-in:</strong> {viewingHotel.check_in_time}
              </div>
              <div>
                <strong>Check-out:</strong> {viewingHotel.check_out_time}
              </div>
            </div>

            <div>
              <strong>Address:</strong> {viewingHotel.address}
            </div>
            <div>
              <strong>Description:</strong> {viewingHotel.description}
            </div>
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
