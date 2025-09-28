import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Tabs, Form, Table, Tag, Typography } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";

import ProfileHeader from "./components/ProfileHeader";
import LoyaltyStatus from "./components/LoyaltyStatus";
import PersonalInfoTab from "./components/PersonalInfoTab";
import SecurityTab from "./components/SecurityTab";
import SavedPropertiesTab from "./components/SavedPropertiesTab";
import SettingsTab from "./components/SettingsTab";
import { useLoyaltyData } from "./hooks/useLoyaltyData";

const { Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [editMode, setEditMode] = useState(false);
  const [passwordForm] = Form.useForm();

  // Get user data from Redux state
  const { user } = useSelector((state) => state.auth);

  // Get loyalty data from API
  const {
    confirmedBookings,
    totalSpent,
    loyaltyPoints,
    loading: loyaltyLoading,
    error: loyaltyError,
  } = useLoyaltyData(user);

  // User info with API data and fallback values
  const userInfo = {
    name: user?.username || "Alexander Morgan",
    email: user?.email || "alex.morgan@email.com",
    phone: user?.phone || "+66 99 999 9999",
    avatar: user?.avatar || null,
    memberSince: user?.created_at
      ? new Date(user.created_at).getFullYear()
      : "2022",
    lastLogin: user?.last_login || "2024-01-15T10:30:00Z",
    confirmedBookings: confirmedBookings,
    totalSpent: totalSpent,
    loyaltyPoints: loyaltyPoints,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <ProfileHeader
        userInfo={userInfo}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      {/* Loyalty Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LoyaltyStatus
          userInfo={userInfo}
          loading={loyaltyLoading}
          error={loyaltyError}
        />

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
              <PersonalInfoTab userInfo={userInfo} editMode={editMode} />
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
              <SecurityTab
                passwordForm={passwordForm}
                handlePasswordChange={handlePasswordChange}
                loginHistory={loginHistory}
                loginColumns={loginColumns}
              />
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
              <SavedPropertiesTab savedProperties={savedProperties} />
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
              <SettingsTab />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
