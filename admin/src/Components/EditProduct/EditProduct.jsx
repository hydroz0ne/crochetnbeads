import React, { useState, useEffect } from "react";
import "./EditProduct.css";
import upload from "../../Assets/upload.png";
import edit from "../../Assets/edit.png";

const EditProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        category: "plushies",
        included: "",
        price: "",
        image: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://crochetnbeads.onrender.com/allproducts');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setProductDetails(product);
        setImage(product.image);
        window.scrollTo({
            top: document.querySelector('.edit-form').offsetTop,
            behavior: 'smooth'
        });
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
        setProductDetails({...productDetails, image: e.target.files[0]});
    };

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            let productToUpdate = {...productDetails};

            if (image && image instanceof File) {
                const formData = new FormData();
                formData.append('image', image);

                const uploadResponse = await fetch('https://crochetnbeads.onrender.com/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Image upload failed');
                }

                const uploadData = await uploadResponse.json();
                if (uploadData.success) {
                    productToUpdate.image = uploadData.secure_url || uploadData.image_url;
                }
            }

            const response = await fetch('https://crochetnbeads.onrender.com/editproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productToUpdate)
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Product updated successfully!');
                fetchProducts();
                setSelectedProduct(null);
                setProductDetails({
                    name: "",
                    description: "",
                    category: "plushies",
                    included: "",
                    price: "",
                    image: ""
                });
                setImage(false);
            } else {
                alert(data.message || 'Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product: ' + error.message);
        }
    };

    return (
        <div className="edit-product">
            <h1>Edit Products</h1>
            <div className="product-list">
                <div className="product-header">
                    <p>Product</p>
                    <p>Name</p>
                    <p>Description</p>
                    <p>Category</p>
                    <p>Price</p>
                    <p>Edit</p>
                </div>
                <div className="product-items">
                    {products.map((product) => {
                        return (
                            <div key={product.id} className="product-item">
                                <img src={product.image} alt={product.name} className="product-image" />
                                <p>{product.name}</p>
                                <p>{product.description}</p>
                                <p className="category">{product.category}</p>
                                <p>{product.price} AED</p>
                                <img src={edit} alt="edit" className="edit" onClick={() => handleEdit(product)}></img>
                            </div>
                        )
                    })}
                </div>
            </div>

            {selectedProduct && (
                <div className="edit-form">
                    <h2>Edit Product: {selectedProduct.name}</h2>
                    <form className="editproduct-form-container" onSubmit={updateProduct}>
                        <div className="form-group">
                            <p>Product Name</p>
                            <input type="text" name="name" value={productDetails.name}  onChange={changeHandler} required/>
                        </div>
                        <div className="form-group">
                            <p>Description</p>
                            <textarea name="description" value={productDetails.description} onChange={changeHandler} required/>
                        </div>
                        <div className="form-group">
                            <p>Category</p>
                            <select name="category" value={productDetails.category} onChange={changeHandler} required>
                                <option value="plushies">Plushies</option>
                                <option value="apparel">Apparel</option>
                                <option value="bouquets">Bouquets</option>
                                <option value="jewelry">Jewelry</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <p>Included Items</p>
                            <input type="text" name="included" value={productDetails.included} onChange={changeHandler}/>
                        </div>
                        <div className="form-group">
                            <p>Price (AED)</p>
                            <input type="number" name="price" value={productDetails.price} onChange={changeHandler} required/>
                        </div>
                        <div className="form-group">
                            <p>Product Image</p>
                            <div className="image-upload">
                                <label htmlFor="file-input">
                                    <img src={image instanceof File ? URL.createObjectURL(image) : image || upload} alt="Upload"/>
                                </label>
                                <input id="file-input" type="file" onChange={imageHandler} accept="image/*" hidden/>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="update-button">Update Product</button>
                            <button type="button" className="cancel-button" onClick={() => setSelectedProduct(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditProduct;