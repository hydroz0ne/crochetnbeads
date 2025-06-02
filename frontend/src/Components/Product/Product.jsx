import React from "react";
import "./Product.css";
import { Link } from "react-router-dom";

const Product = (props) => {
    return (
        <Link 
            to={`/${props.category}/${props.id}`} 
            onClick={() => window.scrollTo(0, 0)}
            className="product-link"
        >
            <div className="product">
                <img src={props.image} alt={props.name} />
                <h2>{props.name}</h2>
                <p>{props.price} AED</p>
            </div>
        </Link>
    );
}

export default Product;