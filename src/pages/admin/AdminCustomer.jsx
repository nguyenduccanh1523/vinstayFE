import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  message,
  Tag,
  Avatar,
  Form,
  Select,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { customerApi } from "../../apis/customerApi";
import { roleApi } from "../../apis/roleApi";

const { Search } = Input;
const { Option } = Select;

const AdminCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (searchText) {
      const key = searchText.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          c.username?.toLowerCase().includes(key) ||
          c.email?.toLowerCase().includes(key) ||
          c.first_name?.toLowerCase().includes(key) ||
          c.last_name?.toLowerCase().includes(key)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchText, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await roleApi.getRoles();
      setRoles(data || []);
    } catch (e) {
      // không chặn UI nếu roles lỗi
      console.error(e);
    }
  };

  const handleSearch = (value) => setSearchText(value);

  const handleView = (record) => {
    setViewingCustomer(record);
    setViewModalVisible(true);
  };

  const openEditRole = (record) => {
    setEditingCustomer(record);
    form.setFieldsValue({
      role_id:
        typeof record.role_id === "object" ? record.role_id?._id : record.role_id,
    });
    setEditModalVisible(true);
  };

  const submitEditRole = async (values) => {
    if (!editingCustomer?._id) return;
    try {
      // chỉ update role
      await customerApi.updateCustomerRole(editingCustomer._id, values.role_id);
      message.success("Updated role successfully");
      setEditModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      fetchCustomers();
    } catch (e) {
      message.error("Failed to update role");
    }
  };

  const getRoleColor = (roleName) => {
    const roleColors = {
      admin: "red",
      hotel_owner: "blue",
      customer: "green",
      staff: "orange",
    };
    return roleColors[roleName] || "default";
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar, record) => (
        <Avatar
          size={40}
          src={avatar}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        >
          {!avatar && (record.first_name?.[0] || record.username?.[0] || "U")}
        </Avatar>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => (a.username || "").localeCompare(b.username || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role",
      render: (role_id) => (
        <Tag color={getRoleColor(role_id?.name)}>
          {role_id?.name?.toUpperCase() || "NO ROLE"}
        </Tag>
      ),
      sorter: (a, b) =>
        (a.role_id?.name || "").localeCompare(b.role_id?.name || ""),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      render: (is_active) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (v, r) => r.is_active === v,
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (last_login) =>
        last_login ? new Date(last_login).toLocaleDateString() : "Never",
      sorter: (a, b) =>
        new Date(a.last_login || 0) - new Date(b.last_login || 0),
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => new Date(created_at).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
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
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditRole(record)}
          >
            Edit Role
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Search customers..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
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

      {/* View Modal */}
      <Modal
        title="Customer Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {viewingCustomer && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                size={64}
                src={viewingCustomer.avatar}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              >
                {!viewingCustomer.avatar &&
                  (viewingCustomer.username?.[0] || "U")}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {viewingCustomer.username}
                </h3>
                <Tag color={getRoleColor(viewingCustomer.role_id?.name)}>
                  {viewingCustomer.role_id?.name?.toUpperCase() || "NO ROLE"}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Username:</strong> {viewingCustomer.username}
              </div>
              <div>
                <strong>Email:</strong> {viewingCustomer.email}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Tag color={viewingCustomer.is_active ? "green" : "red"}>
                  {viewingCustomer.is_active ? "ACTIVE" : "INACTIVE"}
                </Tag>
              </div>
              <div>
                <strong>Role:</strong> {viewingCustomer.role_id?.name || "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Created:</strong>{" "}
                {new Date(viewingCustomer.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Last Login:</strong>{" "}
                {viewingCustomer.last_login
                  ? new Date(viewingCustomer.last_login).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        title={`Edit Role: ${editingCustomer?.username || ""}`}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCustomer(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Save"
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={submitEditRole}>
          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              placeholder="Select role"
              showSearch
              optionFilterProp="children"
            >
              {roles.map((r) => (
                <Option key={r._id} value={r._id}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCustomer;
