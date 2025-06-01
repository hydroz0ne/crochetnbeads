import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const ProductDisplay = (props) => {
    const {item} = props;
    const {addToCart} = useContext(ShopContext);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                setIsLoggedIn(!!token);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading || !item) {
        return (
            <div className="productdisplay-loading">
                <h2>Loading...</h2>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        addToCart(item.id);
    };

    return (
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-main">
                    {item?.image && (
                        <img 
                            className="productdisplay-mainimage" 
                            src={item.image} 
                            alt={item.name || 'Product image'} 
                        />
                    )}
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{item?.name}</h1>
                <div className="productdisplay-info">
                    <p>{item?.description}</p>
                    <div className="productdisplay-details">
                        <h2>Details</h2>
                        <p className="category">Category: {item?.category}</p>
                        <p>Included: {item?.included}</p>
                    </div>
                    <p className="productdisplay-price">Cost: {item?.price} AED</p>
                    <button 
                        onClick={handleAddToCart} 
                        className={`productdisplay-button ${!isLoggedIn ? 'disabled' : ''}`}
                        disabled={!isLoggedIn}
                    >
                        {isLoggedIn ? 'Add to Cart' : 'Login to Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;