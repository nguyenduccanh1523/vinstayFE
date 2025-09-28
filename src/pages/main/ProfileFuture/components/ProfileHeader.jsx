import React from "react";
import { Avatar, Button, Typography } from "antd";
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ProfileHeader = ({ userInfo, editMode, setEditMode }) => {
  return (
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
  );
};

export default ProfileHeader;
