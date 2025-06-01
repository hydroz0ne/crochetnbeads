import React, { useEffect, useState } from "react";
import "./RelatedProducts.css";
import Product from "../Product/Product";

const RelatedProducts = ({ item }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (item && item.category && item.id !== undefined) {
            fetch(`https://crochetnbeads.onrender.com/relatedproducts?category=${item.category}&excludeId=${item.id}`)
                .then((res) => res.json())
                .then((data) => setRelatedProducts(data))
                .catch((err) => console.error("Failed to fetch related products:", err));
        }
    }, [item]);

    return (
        <div className="relatedproducts">
            <h1>Related Products</h1>
            <p>Check other products similar to the shown product here!</p>
            <div className="relatedproducts-list">
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((product, i) => (
                        <Product
                            key={i}
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                            category={product.category}
                        />
                    ))
                ) : (
                    <p>No related products found.</p>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;
