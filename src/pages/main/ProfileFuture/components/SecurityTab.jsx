import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Alert,
  Timeline,
  Typography,
} from "antd";
import {
  LockOutlined,
  ClockCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Text } = Typography;

const SecurityTab = ({
  passwordForm,
  handlePasswordChange,
  loginHistory,
  loginColumns,
}) => {
  return (
    <>
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
                      if (!value || getFieldValue("newPassword") === value) {
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
                <Button type="primary" htmlType="submit" block size="large">
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
                          color={item.status === "success" ? "green" : "red"}
                          size="small"
                        >
                          {item.status}
                        </Tag>
                      </div>
                      <div className="text-sm text-slate-500">
                        {item.location} • {item.ip}
                      </div>
                      <div className="text-xs text-slate-400">{item.time}</div>
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
    </>
  );
};

export default SecurityTab;
