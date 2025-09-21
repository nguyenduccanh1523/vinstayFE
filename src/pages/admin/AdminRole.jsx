import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { roleApi } from "../../apis/roleApi";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const { Title } = Typography;
const { TextArea } = Input;

const AdminRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form] = Form.useForm();

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleApi.getRoles();
      setRoles(data);
    } catch (error) {
      message.error("Failed to fetch roles");
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle create/update role
  const handleSubmit = async (values) => {
    try {
      if (editingRole) {
        await roleApi.updateRole(editingRole._id, values);
        message.success("Role updated successfully");
      } else {
        await roleApi.createRole(values);
        message.success("Role created successfully");
      }

      setModalVisible(false);
      setEditingRole(null);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      message.error(
        editingRole ? "Failed to update role" : "Failed to create role"
      );
      console.error("Error saving role:", error);
    }
  };

  // Handle delete role
  const handleDelete = async (id) => {
    try {
      await roleApi.deleteRole(id);
      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      message.error("Failed to delete role");
      console.error("Error deleting role:", error);
    }
  };

  // Open modal for create/edit
  const openModal = (role = null) => {
    setEditingRole(role);
    setModalVisible(true);
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingRole(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
      <div className="space-y-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="!mb-0">
              Role Management
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRoles}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
              >
                Add Role
              </Button>
            </Space>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} roles`,
            }}
          />
        </Card>

        <Modal
          title={editingRole ? "Edit Role" : "Add New Role"}
          open={modalVisible}
          onCancel={closeModal}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Role Name"
              rules={[
                { required: true, message: "Please enter role name" },
                { min: 2, message: "Role name must be at least 2 characters" },
                { max: 50, message: "Role name must not exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter role name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter description" },
                {
                  min: 5,
                  message: "Description must be at least 5 characters",
                },
                {
                  max: 200,
                  message: "Description must not exceed 200 characters",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter role description" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="flex justify-end w-full">
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {editingRole ? "Update" : "Create"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default AdminRole;
