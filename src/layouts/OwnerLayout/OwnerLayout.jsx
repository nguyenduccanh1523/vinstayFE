// src/layouts/OwnerLayout/OwnerLayout.jsx
import React, { useMemo } from "react";
import { Layout, Menu, theme, Avatar } from "antd";
import {
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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

  const selectedKeys = useMemo(() => {
    const match =
      items.find((i) => pathname === i.key) ||
      items.find((i) => pathname.startsWith(i.key));
    return [match?.key || "/manage-hotel"];
  }, [pathname]);

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark" width={248}>
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar size={36} style={{ background: token.colorPrimary }}>VS</Avatar>
          <div className="text-white font-semibold">VinnStay Owner</div>
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
          <div className="text-base md:text-lg font-semibold">Owner Console</div>
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
