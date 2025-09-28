import React from "react";
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  Switch,
  Space,
  Typography,
  Divider,
} from "antd";

const { Text } = Typography;
const { Option } = Select;

const PersonalInfoTab = ({ userInfo, editMode }) => {
  return (
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
                    defaultValue={userInfo.name.split(" ").slice(1).join(" ")}
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
          <Space direction="vertical" className="w-full" size="middle">
            <div className="flex justify-between items-center">
              <Text>Room Type</Text>
              <Select defaultValue="suite" size="small" className="w-24">
                <Option value="standard">Standard</Option>
                <Option value="deluxe">Deluxe</Option>
                <Option value="suite">Suite</Option>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Text>Bed Type</Text>
              <Select defaultValue="king" size="small" className="w-24">
                <Option value="single">Single</Option>
                <Option value="double">Double</Option>
                <Option value="king">King</Option>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Text>Floor Level</Text>
              <Select defaultValue="high" size="small" className="w-24">
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
  );
};

export default PersonalInfoTab;
