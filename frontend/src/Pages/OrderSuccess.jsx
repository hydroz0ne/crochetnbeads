import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './CSS/OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const orderData = location.state;

    return (
        <div className="order-success">
            <div className="order-success-container">
                <h1>Order Successful!</h1>
                <p>Thank you for shopping at Crochet n' Beads!</p>

                {orderData && (
                    <div className="order-details">
                        <h2>Order Details</h2>
                        <div className="order-items">
                            <h3>Items Ordered</h3>
                            {orderData.items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {item.price} AED</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <h3>Contact and Delivery Information</h3>
                            <p>Phone Number: {orderData.phoneNumber}</p>
                            <p>Delivery Method: {orderData.deliveryMethod}</p>
                            {orderData.address && (
                                <p>Delivery Address: {orderData.address}</p>
                            )}
                            <h3>Cost Breakdown</h3>
                            <p>Subtotal: {orderData.subtotal} AED</p>
                            <p>Shipping Fee: {orderData.shippingFee} AED</p>
                            <h3>Total Amount: {orderData.total} AED</h3>
                            {orderData.notes && (
                                <>
                                    <h3>Additional Notes</h3>
                                    <p className="order-notes">{orderData.notes}</p>
                                </>
                            )}
                        </div>

                        <p className="disclaimer">
                            Please contact me on @crochet.n.beads in Instagram for any further inquiries regarding your order! 
                            You will be called in the number {orderData.phoneNumber}.
                        </p>
                    </div>
                )}
                <Link to="/home" className="back-home-button">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;