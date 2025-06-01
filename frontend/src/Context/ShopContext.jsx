import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i <= 300; i++) {
        cart[i] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_products, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        // Fetch all products
        fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => setAllProducts(data))
            .catch((err) => console.error('Failed to fetch products:', err));

        // Fetch cart items if logged in
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({})
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Cart fetch failed');
                    return res.json();
                })
                .then((data) => setCartItems(data))
                .catch((err) => console.error('Failed to fetch cart:', err));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ itemId })
            })
                .then((res) => res.json())
                .then((data) => console.log('Add to cart response:', data))
                .catch((err) => console.error('Add to cart failed:', err));
        }
    };

    const deleteFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/deletefromcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ itemId })
            })
                .then((res) => res.json())
                .then((data) => console.log('Delete from cart response:', data))
                .catch((err) => console.error('Delete from cart failed:', err));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_products.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartProducts = () => {
        return Object.values(cartItems).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);
    };

    const clearCart = () => {
        const emptyCart = {};
        all_products.forEach((item) => {
            emptyCart[item.id] = 0;
        });
        setCartItems(emptyCart);
    };

    const contextValue = {
        getTotalCartProducts,
        getTotalCartAmount,
        all_products,
        cartItems,
        addToCart,
        deleteFromCart,
        clearCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;