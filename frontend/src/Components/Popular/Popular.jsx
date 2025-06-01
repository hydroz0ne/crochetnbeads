import React, { useEffect, useState, forwardRef } from "react";
import "./Popular.css";
import Product from "../Product/Product";

const Popular = forwardRef((props, ref) => {
    const [popular_products, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => {
                // Get 8 random products from all categories
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 8);
                setPopularProducts(selected);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className='popular' ref={ref}>
            <h1>Popular Products</h1>
            <p>Interested in our popular products? Check them out here!</p>
            <div className='popular-products'>
                {loading ? (
                    <div className="loading-placeholder">Loading products...</div>
                ) : popular_products.length === 0 ? (
                    <div className="no-products-placeholder">
                        <p>No popular products available at the moment. Please check back later!</p>
                    </div>
                ) : (
                    popular_products.map((product) => (
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
});

export default Popular;