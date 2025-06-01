import React from "react";
import "./Product.css";
import { Link } from "react-router-dom";

const Product = (props) => {
    return (
        <div className="product">
            <Link to={`/${props.category}/${props.id}`}>
                <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} />
            </Link>
            <h2>{props.name}</h2>
            <p>{props.price} AED</p>
        </div>
    );
}

export default Product;