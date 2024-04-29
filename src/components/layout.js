import React from 'react';
import { Link } from 'gatsby';
import './layout.css';  // Importing the CSS for the layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
<nav style={{padding: '5px', marginLeft: '10px', marginRight: '10px'}}>
  <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <Link to="/" aria-label="Home">
      <p style={{fontSize: "40px"}}>❀</p>
    </Link>

    <Link to='https://github.com/cscie114/csci-e-114-final-project-cre8ture'
     aria-label="Github">
     <p style={{fontSize: "40px"}}>❁</p>
   </Link>
  </div>
</nav>
      {children}
    </div>
  );
};

export default Layout;