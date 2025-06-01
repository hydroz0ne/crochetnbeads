import React, { useEffect, useState } from 'react';
import './AdminHome.css';

const AdminHome = () => {
  const [productStats, setProductStats] = useState({ total: 0, categories: {} });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const res = await fetch('https://crochetnbeads.onrender.com/allproducts');
        const data = await res.json();

        const categoryMap = {};
        data.forEach((product) => {
          categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
        });

        setProductStats({
          total: data.length,
          categories: categoryMap
        });
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('https://crochetnbeads.onrender.com/allusers');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchProductStats();
    fetchUsers();
  }, []);

    return (
        <div className="adminhome-main">
            <h2>Welcome to the Admin Dashboard 👋</h2>
            <p>Use the sidebar to add new products or manage your listings.</p>

        <div className="adminhome-statbox">
            <h3>👥 User Summary</h3>
            <p><strong>Total Users:</strong> {users.length}</p>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.username} ({user.email})</li>
                ))}
            </ul>
        </div>

        <div className="adminhome-statbox">
            <h3>📦 Product Summary</h3>
            <p><strong>Total Products:</strong> {productStats.total}</p>
                <ul>
                    {Object.keys(productStats.categories).map(cat => (
                    <ul key={cat}>Number of <strong>{cat}</strong>: {productStats.categories[cat]}</ul>
                ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminHome;