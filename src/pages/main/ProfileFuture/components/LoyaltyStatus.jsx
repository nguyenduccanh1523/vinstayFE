import React from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Badge,
  Statistic,
  Progress,
  Typography,
  Spin,
  Alert,
} from "antd";
import { GiftOutlined } from "@ant-design/icons";
import {
  getLoyaltyTier,
  getNextTierProgress,
  getNextTierName,
  getNextTierRequirements,
  calculateLoyaltyPoints,
} from "../utils/loyaltyUtils";

const { Text } = Typography;

const LoyaltyStatus = ({ userInfo, loading, error }) => {
  if (loading) {
    return (
      <Card className="mb-6 text-center">
        <Spin size="large" />
        <div className="mt-4">Loading loyalty information...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <Alert
          message="Unable to load loyalty information"
          description={error}
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  const currentTier = getLoyaltyTier(
    userInfo.confirmedBookings,
    userInfo.totalSpent
  );
  const nextTierProgress = getNextTierProgress(
    userInfo.confirmedBookings,
    userInfo.totalSpent
  );
  const nextTierName = getNextTierName(
    userInfo.confirmedBookings,
    userInfo.totalSpent
  );
  const requirements = getNextTierRequirements(
    userInfo.confirmedBookings,
    userInfo.totalSpent
  );

  // Calculate loyalty points with tier multiplier
  const loyaltyPoints = calculateLoyaltyPoints(
    userInfo.confirmedBookings,
    userInfo.totalSpent
  );

  return (
    <Card
      className={`mb-6 bg-gradient-to-r ${currentTier.bgColor} border-yellow-200`}
    >
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} sm={6} md={4}>
          <div className="text-center">
            <Badge count={currentTier.name} className="mb-2">
              <Avatar
                size={64}
                icon={<GiftOutlined />}
                style={{ backgroundColor: currentTier.color }}
              />
            </Badge>
            <div className="text-sm font-medium">{currentTier.name} Member</div>
            <div className="text-xs text-slate-500">
              {currentTier.multiplier}x Points Multiplier
            </div>
          </div>
        </Col>
        <Col xs={24} sm={18} md={20}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Confirmed Bookings"
                value={userInfo.confirmedBookings || 0}
                valueStyle={{ color: currentTier.color }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Total Spent"
                value={userInfo.totalSpent || 0}
                formatter={(value) =>
                  `$${Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
                valueStyle={{ color: "#059669" }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Loyalty Points"
                value={loyaltyPoints}
                suffix="pts"
                valueStyle={{ color: "#d97706" }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <div>
                <Text className="text-sm text-slate-600">
                  {nextTierName
                    ? `Progress to ${nextTierName}`
                    : "Maximum Tier Reached"}
                </Text>
                <Progress
                  percent={nextTierProgress}
                  strokeColor={currentTier.color}
                  className="mb-2"
                  status={
                    nextTierProgress === 100 && requirements
                      ? "success"
                      : "normal"
                  }
                />
                {requirements && (
                  <div className="text-xs text-slate-500 space-y-1">
                    {requirements.bookingsNeeded > 0 && (
                      <div>
                        Need {requirements.bookingsNeeded} more bookings (
                        {requirements.currentBookings}/
                        {requirements.requiredBookings})
                      </div>
                    )}
                    {requirements.amountNeeded > 0 && (
                      <div>
                        Need $
                        {requirements.amountNeeded.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        more spent ($
                        {requirements.currentSpent.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                        /{requirements.requiredSpent.toLocaleString("en-US")})
                      </div>
                    )}
                    {requirements.bookingsNeeded === 0 &&
                      requirements.amountNeeded === 0 && (
                        <div className="text-green-600 font-medium">
                          ✓ Ready to advance to {nextTierName}!
                        </div>
                      )}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default LoyaltyStatus;
