import React, { useEffect, useState } from 'react';
import './ListOrders.css';

const ListOrders = () => {
    const [orders, setOrders] = useState([]);

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`https://crochetnbeads.onrender.com/delete-order/${orderId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setOrders(orders.filter(order => order._id !== orderId));
                }
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://crochetnbeads.onrender.com/all-orders');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="orders-list">
            <h1>Current Orders</h1>
            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h4>Order #{order._id}</h4>
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>{item.name}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-details">
                            <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
                            {order.address && <p><strong>Address:</strong> {order.address}</p>}
                            <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            <p><strong>Total:</strong> {order.total} AED</p>
                            {order.notes && (
                                <p><strong>Notes:</strong> {order.notes}</p>
                            )}
                            <button className="delete-button" onClick={() => handleDeleteOrder(order._id)}>Delete Order</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListOrders;