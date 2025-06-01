import React, {useState} from "react";
import "./AddProduct.css";
import uploadimg from "../../Assets/upload.png";

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        category: "plushies",
        included: "",
        price: "",
        image: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
        setProductDetails({...productDetails, image: e.target.files[0]});
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    }

    const add_product = async (e) => {
        e.preventDefault(); 
        try {
            let responseData;
            let product = productDetails;
    
            let formData = new FormData();
            formData.append('image', image); 
    
            const response = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData, 
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            responseData = await response.json();
    
            if (responseData.success) {
                product.image = responseData.image_url;
                console.log("Product Details after image upload: ", product);
                await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                }).then((resp) => resp.json()).then((data) => {
                    data.success ? alert("Product added successfully!") : alert("Failed to add product!")
                });
            } 
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    }

    return (
        <div className="add-product">
            <div className="addproduct-form">
                <form className="addproduct-form-container" onSubmit={add_product}>
                    <div className="addproduct-form-group">
                        <p>Product Name</p>
                        <input value={productDetails.name} onChange={changeHandler} placeholder="Name" type="text" id="name" name="name" required />
                    </div>
                    <div className="addproduct-form-group">
                        <p>Product Description</p>
                        <textarea value={productDetails.description} onChange={changeHandler} placeholder="Description" id="description" name="description" required></textarea>
                    </div>
                    <div className="addproduct-form-group">
                        <p>Product Included Item(s)</p>
                        <input value={productDetails.included} onChange={changeHandler} placeholder="Item(s) included in the product" type="text" id="included" name="included"></input>
                    </div>
                    <div className="addproduct-form-group">
                        <p>Product Category</p>
                        <select value={productDetails.category} onChange={changeHandler} id="category" name="category" required>
                            <option value="plushies">Plushies</option>
                            <option value="apparel">Apparel</option>
                            <option value="bouquets">Bouquets</option>
                            <option value="jewelry">Jewelry</option>
                        </select>
                    </div>
                    <div className="addproduct-form-group">
                        <p>Price</p>
                        <input value={productDetails.price} onChange={changeHandler} type="number" id="price" name="price" required />
                    </div>
                    <div className="addproduct-form-group">
                        <p>Upload Product Image</p>
                        <label htmlFor="file-input" className="addproduct-imageinput-label">
                            <img src={image?URL.createObjectURL(image):uploadimg} alt="Product" className="addproduct-imageinput" />
                            <input onChange={imageHandler} type="file" id="file-input" name="image" hidden />
                        </label>
                    </div>
                    <button className="addproduct-button" type="submit">Add Product</button>
                </form>
            </div>
        </div>
    )
}

export default AddProduct;