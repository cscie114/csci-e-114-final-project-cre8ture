import React from 'react';
import './layout.css';  // Importing the CSS for the layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
