import React from 'react';
import { Link } from 'gatsby';
import './layout.css';  // Importing the CSS for the layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav style={{padding: '5px', marginLeft: '10px'}}>
        <Link to="/" aria-label="Home">
          <p style={{fontSize: "40px"}}>❀</p>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;