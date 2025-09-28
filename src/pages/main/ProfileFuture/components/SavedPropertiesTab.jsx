import React from "react";
import { Card, Row, Col, Button, Rate, Typography } from "antd";
import { HeartOutlined, HomeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SavedPropertiesTab = ({ savedProperties }) => {
  return (
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
                    <Text className="text-slate-500">{property.location}</Text>
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
  );
};

export default SavedPropertiesTab;
