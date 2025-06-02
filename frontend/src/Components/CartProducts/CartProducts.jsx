import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartProducts.css";
import { ShopContext } from "../../Context/ShopContext";
import remove from "../Assets/remove.png";

const CartProducts = () => {
    const navigate = useNavigate();
    const { getTotalCartAmount, all_products, cartItems, deleteFromCart, clearCart } = useContext(ShopContext);
    
    const [shippingFee, setShippingFee] = useState(0);
    const [selectedDelivery, setSelectedDelivery] = useState("Pickup at Al Wahda Mall");
    const [customAddress, setCustomAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [notes, setNotes] = useState(""); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            alert('Please log in to access the cart.');
            return;
        }
    }, [navigate]);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setPhoneNumber(value);
        }
    };

    const isValidPhoneNumber = (phone) => {
        return /^05\d{8}$/.test(phone);
    };

    const handleOrderSubmit = async () => {
        if (!isValidPhoneNumber(phoneNumber)) {
            alert("Please enter a valid UAE phone number (starting with 05, 10 digits)");
            return;
        }

        if (selectedDelivery === "Doorstep Delivery" && !customAddress.trim()) {
            alert("Please enter your delivery address.");
            return;
        }

        try {
            const orderItems = all_products
                .filter(product => cartItems[product.id] > 0)
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    quantity: cartItems[product.id],
                    price: product.price
                }));

            const orderData = {
                items: orderItems,
                deliveryMethod: selectedDelivery,
                phoneNumber: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'), 
                address: customAddress,
                notes: notes, 
                subtotal: getTotalCartAmount(),
                shippingFee: shippingFee,
                total: getTotalCartAmount() + shippingFee
            };

            const response = await fetch('https://crochetnbeads.onrender.com/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token')
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log('Order response:', data); 

            if (data.success) {
                clearCart();
                alert('Order placed successfully! Check your email for confirmation.');
                navigate('/order-success', { state: orderData });
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            alert('Failed to place order: ' + error.message);
        }
    };

    const handleCancelOrder = () => {
        if (window.confirm('Are you sure you want to cancel your order?')) {
            clearCart();
            navigate('/order-cancel');
        }
    };

    return (
        <div className="cart-products">
            {localStorage.getItem('token') ? (
                <>
                    <h1 className="cartproducts-header">Your Cart</h1>
                    <p className="cartproducts-subheader">Check your selected items and total here!</p>
                    <div className="cartproducts-listheader">
                        <p>Product</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p></p>
                    </div>

                    <hr />

                    {all_products.map((e) => {
                        if (cartItems[e.id] > 0) {
                            return (
                                <div key={e.id}>
                                    <div className="cart-products-list">
                                        <img className="cartitem-image" src={e.image} alt={e.name} />
                                        <p>{e.name}</p>
                                        <p>{e.price} AED</p>
                                        <button className="cartitem-amount">{cartItems[e.id]}</button>
                                        <p>{e.price * cartItems[e.id]} AED</p>
                                        <img 
                                            className="cartitem-remove" 
                                            src={remove} 
                                            onClick={() => deleteFromCart(e.id)} 
                                            alt="Remove Product" 
                                        />
                                    </div>
                                    <hr />
                                </div>
                            );
                        }
                        return null;
                    })}

                    <div className="cartproducts-underlist">
                        <div className="cartproducts-total">
                            <h1>Cart Total</h1>
                            <div>
                                <h3 className="cartproducts-totalprice">
                                    Subtotal: {getTotalCartAmount()} AED
                                </h3>
                            </div>
                            <hr />
                            <div>
                                <h3>Delivery</h3>
                                <input 
                                    type="radio" 
                                    name="location" 
                                    id="location1" 
                                    value="Pickup at Al Wahda Mall"
                                    checked={selectedDelivery === "Pickup at Al Wahda Mall"}
                                    onChange={() => {
                                        setSelectedDelivery("Pickup at Al Wahda Mall");
                                        setShippingFee(0);
                                        setCustomAddress("");
                                    }} 
                                />
                                <label htmlFor="location1">
                                    Pickup at Al Wahda Mall: <span>FREE</span>
                                </label>

                                <br />

                                <input
                                    type="radio" 
                                    name="location" 
                                    id="location2" 
                                    value="Doorstep Delivery"
                                    checked={selectedDelivery === "Doorstep Delivery"}
                                    onChange={() => {
                                        setSelectedDelivery("Doorstep Delivery");
                                        setShippingFee(5);
                                    }} 
                                />
                                <label htmlFor="location2">
                                    Doorstep Delivery: <span>5 AED</span>
                                </label>
                                
                                {selectedDelivery === "Doorstep Delivery" && (
                                    <div className="cartproducts-address">
                                        <input 
                                            className="cartproducts-addressinput" 
                                            type="text" 
                                            placeholder="Enter your delivery address" 
                                            value={customAddress} 
                                            onChange={(e) => setCustomAddress(e.target.value)}
                                        />
                                    </div>
                                )}

                                <h3>Phone Number</h3>
                                <div className="cartproducts-phone">
                                    <input 
                                        className={`cartproducts-phoneinput ${phoneNumber && !isValidPhoneNumber(phoneNumber) ? 'invalid' : ''}`}
                                        type="tel"
                                        placeholder="Enter your phone number (05xxxxxxxx)." 
                                        value={phoneNumber} 
                                        onChange={handlePhoneNumberChange}
                                        maxLength={10}
                                    />
                                    {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                                        <p className="phone-error">Please enter a valid UAE phone number (05xxxxxxxx).</p>
                                    )}
                                </div>

                                <h3>Additional Notes</h3>
                                <div className="cartproducts-notes">
                                    <textarea
                                        className="cartproducts-notesinput"
                                        placeholder="Add any special instructions or notes here..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div>
                                <h2 className="cartproducts-totalprice">
                                    Total: {getTotalCartAmount()} AED 
                                    {selectedDelivery === "Doorstep Delivery" && " + 5 AED Delivery Fee"}
                                </h2>
                            </div>
                            <div className="cartproducts-buttons">
                                <button 
                                    className="cartproducts-checkoutbutton" 
                                    onClick={handleOrderSubmit} 
                                    disabled={all_products.every(e => cartItems[e.id] === 0)}
                                >
                                    Confirm Order
                                </button>
                                <button 
                                    className="cartproducts-cancelbutton" 
                                    onClick={handleCancelOrder}
                                    disabled={all_products.every(e => cartItems[e.id] === 0)}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="cart-login-message">
                    <h2>Please log in to view your cart</h2>
                    <button onClick={() => navigate('/login')} className="cart-login-button">
                        Go to Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartProducts;