export { default } from './ProfileFuture/ProfilePage';
import { useSelector } from "react-redux";
import {
  Card,
  Avatar,
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Rate,
  Progress,
  Badge,
  Switch,
  Select,
  DatePicker,
  Upload,
  Divider,
  Row,
  Col,
  Space,
  Typography,
  Statistic,
  Alert,
  Timeline,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  HeartOutlined,
  SettingOutlined,
  CameraOutlined,
  StarOutlined,
  GiftOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  BellOutlined,
  SafetyOutlined,
  LockOutlined,
  ClockCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [editMode, setEditMode] = useState(false);
  const [passwordForm] = Form.useForm();

  // Get user data from Redux state
  const { user } = useSelector((state) => state.auth);

  // User info with state data and fallback values
  const userInfo = {
    name: user?.username || "Alexander Morgan",
    email: user?.email || "alex.morgan@email.com",
    phone: user?.phone || "+66 99 999 9999",
    avatar: user?.avatar || null,
    memberSince: user?.created_at
      ? new Date(user.created_at).getFullYear()
      : "2022",
    lastLogin: user?.last_login || "2024-01-15T10:30:00Z",
    loyaltyPoints: user?.loyalty_points || 2847,
    loyaltyTier: user?.loyalty_tier || "Gold",
    totalBookings: user?.total_bookings || 12,
    totalSpent: user?.total_spent || 125000,
    nextTierProgress: 75,
  };

  // Mock login history data
  const loginHistory = [
    {
      key: "1",
      device: "Chrome on Windows",
      location: "Bangkok, Thailand",
      ip: "192.168.1.1",
      time: "2024-01-15 10:30:00",
      status: "success",
    },
    {
      key: "2",
      device: "Safari on iPhone",
      location: "Bangkok, Thailand",
      ip: "192.168.1.5",
      time: "2024-01-14 08:15:00",
      status: "success",
    },
    {
      key: "3",
      device: "Chrome on Android",
      location: "Chiang Mai, Thailand",
      ip: "10.0.0.1",
      time: "2024-01-12 14:20:00",
      status: "failed",
    },
  ];

  const loginColumns = [
    {
      title: "Device & Browser",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "success" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const handlePasswordChange = async (values) => {
    try {
      // Call API to change password
      console.log("Password change values:", values);
      // Reset form after successful change
      passwordForm.resetFields();
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  const savedProperties = [
    {
      key: "1",
      name: "Oceanview Hotel Koh Samui",
      location: "Koh Samui, Thailand",
      image: "/api/placeholder/300/200",
      price: "฿8,500",
      rating: 4.8,
    },
    {
      key: "2",
      name: "Oceanview Hotel Krabi",
      location: "Krabi, Thailand",
      image: "/api/placeholder/300/200",
      price: "฿6,800",
      rating: 4.6,
    },
  ];

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (text) => (
        <Text className="font-mono text-slate-600">{text}</Text>
      ),
    },
    {
      title: "Hotel & Dates",
      key: "details",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.hotel}</div>
          <div className="text-sm text-slate-500">{record.dates}</div>
          <div className="text-xs text-slate-400">{record.guests}</div>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <Text className="font-semibold">{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "Upcoming"
              ? "blue"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) =>
        rating ? (
          <Rate disabled defaultValue={rating} />
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar
                size={80}
                src={userInfo.avatar}
                icon={<UserOutlined />}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              />
              <Button
                icon={<CameraOutlined />}
                size="small"
                className="absolute -bottom-1 -right-1 rounded-full"
              />
            </div>
            <div className="flex-1">
              <Title level={2} className="!mb-2">
                {userInfo.name}
              </Title>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <MailOutlined /> {userInfo.email}
                </span>
                <span className="flex items-center gap-1">
                  <PhoneOutlined /> {userInfo.phone}
                </span>
                <span className="flex items-center gap-1">
                  <StarOutlined /> Member since {userInfo.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined /> Last login:{" "}
                  {new Date(userInfo.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditMode(!editMode)}
              className="self-start"
            >
              {editMode ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      {/* Loyalty Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={6} md={4}>
              <div className="text-center">
                <Badge count={userInfo.loyaltyTier} className="mb-2">
                  <Avatar
                    size={64}
                    icon={<GiftOutlined />}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </Badge>
                <div className="text-sm font-medium">
                  {userInfo.loyaltyTier} Member
                </div>
              </div>
            </Col>
            <Col xs={24} sm={18} md={20}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Loyalty Points"
                    value={userInfo.loyaltyPoints}
                    suffix="pts"
                    valueStyle={{ color: "#d97706" }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Total Bookings"
                    value={userInfo.totalBookings}
                    valueStyle={{ color: "#059669" }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <div>
                    <Text className="text-sm text-slate-600">
                      Progress to Platinum
                    </Text>
                    <Progress
                      percent={userInfo.nextTierProgress}
                      strokeColor="#d97706"
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Main Content */}
        <Card className="shadow-sm">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Personal Info
                </span>
              }
              key="1"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card title="Basic Information" className="h-full">
                    <Form layout="vertical" disabled={!editMode}>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item label="First Name">
                            <Input defaultValue={userInfo.name.split(" ")[0]} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item label="Last Name">
                            <Input
                              defaultValue={userInfo.name
                                .split(" ")
                                .slice(1)
                                .join(" ")}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Email">
                        <Input defaultValue={userInfo.email} />
                      </Form.Item>
                      <Form.Item label="Phone">
                        <Input defaultValue={userInfo.phone} />
                      </Form.Item>
                      <Form.Item label="Date of Birth">
                        <DatePicker className="w-full" />
                      </Form.Item>
                      <Form.Item label="Country/Region">
                        <Select defaultValue="thailand">
                          <Option value="thailand">Thailand</Option>
                          <Option value="vietnam">Vietnam</Option>
                          <Option value="singapore">Singapore</Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Preferences" className="h-full">
                    <Space
                      direction="vertical"
                      className="w-full"
                      size="middle"
                    >
                      <div className="flex justify-between items-center">
                        <Text>Room Type</Text>
                        <Select
                          defaultValue="suite"
                          size="small"
                          className="w-24"
                        >
                          <Option value="standard">Standard</Option>
                          <Option value="deluxe">Deluxe</Option>
                          <Option value="suite">Suite</Option>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Bed Type</Text>
                        <Select
                          defaultValue="king"
                          size="small"
                          className="w-24"
                        >
                          <Option value="single">Single</Option>
                          <Option value="double">Double</Option>
                          <Option value="king">King</Option>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Floor Level</Text>
                        <Select
                          defaultValue="high"
                          size="small"
                          className="w-24"
                        >
                          <Option value="low">Low</Option>
                          <Option value="mid">Mid</Option>
                          <Option value="high">High</Option>
                        </Select>
                      </div>
                      <Divider />
                      <div className="flex justify-between items-center">
                        <Text>Smoking</Text>
                        <Switch size="small" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>Pet Friendly</Text>
                        <Switch size="small" />
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <LockOutlined />
                  Security
                </span>
              }
              key="2"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="flex items-center gap-2">
                        <LockOutlined /> Change Password
                      </span>
                    }
                    className="h-full"
                  >
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handlePasswordChange}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[
                          {
                            required: true,
                            message: "Please input your current password!",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter current password"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                          {
                            required: true,
                            message: "Please input your new password!",
                          },
                          {
                            min: 8,
                            message: "Password must be at least 8 characters!",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter new password"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your new password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("newPassword") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Passwords do not match!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          placeholder="Confirm new password"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Alert
                        message="Password Requirements"
                        description="Use 8+ characters with a mix of letters, numbers & symbols."
                        type="info"
                        showIcon
                        className="mb-4"
                      />

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          size="large"
                        >
                          Update Password
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="flex items-center gap-2">
                        <ClockCircleOutlined /> Login History
                      </span>
                    }
                    className="h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Text strong>Recent Activity</Text>
                        <Text type="secondary" className="text-sm">
                          Last updated: {new Date().toLocaleDateString()}
                        </Text>
                      </div>

                      <Timeline
                        items={loginHistory.slice(0, 3).map((item) => ({
                          color: item.status === "success" ? "green" : "red",
                          children: (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <Text strong>{item.device}</Text>
                                <Tag
                                  color={
                                    item.status === "success" ? "green" : "red"
                                  }
                                  size="small"
                                >
                                  {item.status}
                                </Tag>
                              </div>
                              <div className="text-sm text-slate-500">
                                {item.location} • {item.ip}
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.time}
                              </div>
                            </div>
                          ),
                        }))}
                      />

                      <Button type="link" className="p-0 h-auto">
                        View Full Login History
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]} className="mt-6">
                <Col span={24}>
                  <Card title="Login History Details">
                    <Table
                      columns={loginColumns}
                      dataSource={loginHistory}
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: 800 }}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <HeartOutlined />
                  Saved Properties
                </span>
              }
              key="3"
            >
              <div className="space-y-6">
                <Title level={4}>Your Wishlist</Title>
                <Row gutter={[24, 24]}>
                  {savedProperties.map((property) => (
                    <Col xs={24} sm={12} lg={8} key={property.key}>
                      <Card
                        hoverable
                        cover={
                          <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <HomeOutlined className="text-4xl text-slate-400" />
                          </div>
                        }
                        actions={[
                          <Button
                            type="text"
                            icon={<HeartOutlined />}
                            className="text-red-500"
                          />,
                          <Button type="primary">Book Now</Button>,
                        ]}
                      >
                        <Card.Meta
                          title={property.name}
                          description={
                            <div className="space-y-2">
                              <Text className="text-slate-500">
                                {property.location}
                              </Text>
                              <div className="flex justify-between items-center">
                                <Rate
                                  disabled
                                  defaultValue={property.rating}
                                  className="text-sm"
                                />
                                <Text className="font-semibold text-lg">
                                  {property.price}/night
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SettingOutlined />
                  Settings
                </span>
              }
              key="4"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="flex items-center gap-2">
                        <BellOutlined /> Notifications
                      </span>
                    }
                  >
                    <Space
                      direction="vertical"
                      className="w-full"
                      size="middle"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>Email Notifications</Text>
                          <div className="text-sm text-slate-500">
                            Receive booking confirmations and updates
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>SMS Notifications</Text>
                          <div className="text-sm text-slate-500">
                            Get SMS alerts for bookings
                          </div>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>Marketing Emails</Text>
                          <div className="text-sm text-slate-500">
                            Special offers and promotions
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="flex items-center gap-2">
                        <SafetyOutlined /> Account Security
                      </span>
                    }
                  >
                    <Space
                      direction="vertical"
                      className="w-full"
                      size="middle"
                    >
                      <Button block>Two-Factor Authentication</Button>
                      <Button block>Active Sessions</Button>
                      <Button block>Download Account Data</Button>
                      <Divider />
                      <Button block type="primary" danger>
                        Delete Account
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
