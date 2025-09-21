import React from "react";
import Header from "../../components/Sidebar/Header";
import Footer from "../../components/Sidebar/Footer";


const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto] bg-slate-50">
      <Header />
      <main className="[&>*]:scroll-mt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
