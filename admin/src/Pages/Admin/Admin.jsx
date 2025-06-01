import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import EditProduct from '../../Components/EditProduct/EditProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import ListUsers from '../../Components/ListUsers/ListUsers';
import ListOrders from '../../Components/ListOrders/ListOrders';
import AdminHome from './AdminHome';
import AdminLogin from './AdminLogin';

const Admin = () => {
  const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  const navigate = useNavigate();

  return isLoggedIn ? (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/editproduct" element={<EditProduct />} />
        <Route path="/productlist" element={<ListProduct />} />
        <Route path="/listusers" element={<ListUsers />} />
        <Route path="/listorders" element={<ListOrders />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  ) : (
    <AdminLogin onLogin={() => navigate('/')} />
  );
};

export default Admin;