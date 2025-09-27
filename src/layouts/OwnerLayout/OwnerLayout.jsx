// src/layouts/OwnerLayout/OwnerLayout.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, theme, Avatar, Tag, Button, Tooltip } from "antd";
import {
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  FundOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

const { Sider, Content, Header } = Layout;

const items = [
  { key: "/manage-hotel", icon: <DashboardOutlined />, label: "Overview" },
  { key: "/manage-hotel/hotels", icon: <HomeOutlined />, label: "Hotels" },
  { key: "/manage-hotel/rooms", icon: <AppstoreOutlined />, label: "Rooms" },
  { key: "/manage-hotel/bookings", icon: <BookOutlined />, label: "Bookings" },
  { key: "/manage-hotel/revenue", icon: <FundOutlined />, label: "Revenue" },
];

export default function OwnerLayout() {
  const { token } = theme.useToken();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((s) => s.auth);

  const selectedKeys = useMemo(() => {
    const match =
      items.find((i) => pathname === i.key) ||
      items.find((i) => pathname.startsWith(i.key));
    return [match?.key || "/manage-hotel"];
  }, [pathname]);

  const roleName = user?.role_id?.name ?? "hotel_owner";
  const initials =
    (user?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark" width={248}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar size={36} style={{ background: token.colorPrimary }}>
            VS
          </Avatar>
          <div className="text-white font-semibold leading-tight">
            VinnStay Owner
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={items}
          onClick={({ key }) => nav(key)}
        />
      </Sider>

      <Layout>
        <Header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Title / breadcrumb slot */}
            <div className="text-base md:text-lg font-semibold">
              Owner Console
            </div>

            {/* Right: owner info + Visit Site */}
            <div className="flex items-center gap-3">
              <Tooltip title="Visit public site">
                <Link to="/" className="hidden sm:block">
                  <Button icon={<ArrowRightOutlined />} size="middle">
                    Visit Site
                  </Button>
                </Link>
              </Tooltip>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <Avatar
                  size={36}
                  src={user?.avatar}
                  style={{ background: token.colorPrimary }}
                >
                  {!user?.avatar && initials}
                </Avatar>
                <div className="flex flex-col leading-tight">
                  <span className="text-slate-900 text-sm font-medium">
                    {user?.username || "Owner"}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {user?.email || ""}
                  </span>
                </div>
                <Tag color="blue" className="ml-1 capitalize">
                  {roleName}
                </Tag>
              </div>

              {/* On mobile, compact owner chip */}
              <Link to="/" className="sm:hidden">
                <Button shape="circle" icon={<ArrowRightOutlined />} />
              </Link>
            </div>
          </div>
        </Header>

        <Content className="p-3 md:p-6">
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-5">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
