import React from "react";
import {
  Card,
  Row,
  Col,
  Switch,
  Button,
  Space,
  Typography,
  Divider,
} from "antd";
import { BellOutlined, SafetyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const SettingsTab = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card
          title={
            <span className="flex items-center gap-2">
              <BellOutlined /> Notifications
            </span>
          }
        >
          <Space direction="vertical" className="w-full" size="middle">
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
          <Space direction="vertical" className="w-full" size="middle">
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
  );
};

export default SettingsTab;
