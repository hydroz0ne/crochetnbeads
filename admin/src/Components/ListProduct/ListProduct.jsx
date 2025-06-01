import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import remove from "../../Assets/remove.png";

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch("https://crochetnbeads.onrender.com/allproducts?isAdmin=true");
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchInfo();
    },[]);

    const remove_product = async (id) => {
        await fetch('https://crochetnbeads.onrender.com/removeproduct', {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        await fetchInfo();
        alert("Product removed successfully!");
    }

    const toggleAvailability = async (id) => {
    try {
        const response = await fetch(`https://crochetnbeads.onrender.com/toggle-availability/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
        
            if (data.success) {
                await fetchInfo();
                console.log('Product updated:', data.product);
            } else {
                throw new Error(data.message || 'Failed to update availability');
            }
        } catch (error) {
            console.error('Error updating availability:', error);
            alert('Error updating availability: ' + error.message);
        }
    };

    return (
        <div className="list-product">
            <h1>All Products</h1>
            <div className="listproduct-main">
                <div className='listproduct-header'>
                    <p>Product</p>
                    <p>Name</p>
                    <p>Category</p>
                    <p>Price</p>
                    <p>Availability</p>
                    <p>Remove</p>
                </div>
                <div className='listproduct-allproducts'>
                    {allproducts.map((product, index) => {
                        return (
                            <div key={index} className={`listproduct-product ${!product.available ? 'unavailable' : ''}`}>
                                <img src={product.image} alt={product.name} />
                                <p>{product.name}</p>
                                <p className="category">{product.category}</p>
                                <p>{product.price} AED</p>
                                <button 
                                    onClick={() => toggleAvailability(product.id)}
                                    className={`toggle-btn ${product.available ? 'available' : 'unavailable'}`}
                                >
                                    {product.available ? 'Available' : 'Unavailable'}
                                </button>
                                <img 
                                    src={remove} 
                                    alt="remove" 
                                    className="remove" 
                                    onClick={() => remove_product(product.id)}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ListProduct;