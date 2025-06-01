import React, { useEffect, useState } from "react";
import "./NewProducts.css";
import Product from "../Product/Product";

const NewProducts = () => {
    const [new_products, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/newproducts')
            .then((res) => res.json())
            .then((data) => {
                setNewProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching new products:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="new_products">
            <h1>New Products</h1>
            <p>Interested at currently popular products? Check them here!</p>
            <div className="products">
                {loading ? (
                    <div className="loading-placeholder">Loading products...</div>
                ) : new_products.length === 0 ? (
                    <div className="no-products-placeholder">
                        <p>No new products available at the moment. Please check back later!</p>
                    </div>
                ) : (
                    new_products.map((product) => (
                        <Product 
                            key={product.id} 
                            id={product.id} 
                            name={product.name} 
                            image={product.image} 
                            price={product.price}
                            category={product.category} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NewProducts;