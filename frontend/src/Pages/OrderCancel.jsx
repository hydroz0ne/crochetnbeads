import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/OrderCancel.css';

const OrderCancel = () => {
    return (
        <div className="order-cancel">
            <div className="order-cancel-container">
                <h1>Order Cancelled</h1>
                <p>Your order has been cancelled. Thank you for visiting Crochet n' Beads!</p>
                <Link to="/home" className="return-home">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderCancel;