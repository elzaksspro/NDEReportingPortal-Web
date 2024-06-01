import React from 'react';
import { TopNavBar, Sidebar, Footer } from '@/features/Common';
import './MainLayout.css'; // Import CSS for MainLayout component

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout-container">
      <TopNavBar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
