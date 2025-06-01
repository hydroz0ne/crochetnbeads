import React from "react";
import './Sidebar.css';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
        <Link to={'/addproduct'} style={{textDecoration:"none"}} className="sidebar-link">
            <button className="sidebar-item">Add Product</button>
        </Link>
        <Link to={'/editproduct'} style={{textDecoration:"none"}} className="sidebar-link">
            <button className="sidebar-item">Edit Product</button>
        </Link>
        <Link to={'/productlist'} style={{textDecoration:"none"}} className="sidebar-link">
            <button className="sidebar-item">Product List</button>
        </Link>
        <Link to={'/listusers'} style={{textDecoration:"none"}} className="sidebar-link">
            <button className="sidebar-item">User List</button>
        </Link>
        <Link to={'/listorders'} style={{ textDecoration: 'none' }} className="sidebar-link">
            <button className="sidebar-item">Orders</button>
        </Link>
    </div>
  );
}

export default Sidebar;