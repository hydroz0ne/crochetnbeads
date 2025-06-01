import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown from '../Components/Assets/dropdown.png';
import Product from '../Components/Product/Product';

const ShopCategory = (props) => {
    const { all_products } = useContext(ShopContext);
    const [sortBy, setSortBy] = useState('default');
    const [showDropdown, setShowDropdown] = useState(false);
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        const filtered = all_products.filter(product => product.category === props.category);
        setCategoryProducts(filtered);
    }, [all_products, props.category]);

    // Sort products based on selection
    const sortProducts = () => {
        let sortedProducts = [...categoryProducts];
        switch(sortBy) {
            case 'price-low':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sortedProducts;
        }
    };

    const formatCategoryName = (category) => {
        return category.charAt(0) + category.slice(1);
    };

    return (
        <div className='shop-category'>
            <div className='shop-category-list'>
                <p>
                    Showing <span>{categoryProducts.length}</span> products in the <span>{formatCategoryName(props.category)}</span> category.
                </p>
                <div className='shop-category-sort'>
                    <div className='sort-dropdown' onClick={() => setShowDropdown(!showDropdown)}>
                        Sort by: {sortBy.replace('-', ' ').toUpperCase()}
                        <img src={dropdown} alt="dropdown" className={showDropdown ? 'rotated' : ''} />
                    </div>
                    {showDropdown && (
                        <div className='sort-options'>
                            <div onClick={() => {setSortBy('default'); setShowDropdown(false)}}>Default</div>
                            <div onClick={() => {setSortBy('price-low'); setShowDropdown(false)}}>Price: Low to High</div>
                            <div onClick={() => {setSortBy('price-high'); setShowDropdown(false)}}>Price: High to Low</div>
                            <div onClick={() => {setSortBy('name-asc'); setShowDropdown(false)}}>Name: A to Z</div>
                            <div onClick={() => {setSortBy('name-desc'); setShowDropdown(false)}}>Name: Z to A</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='shop-category-products'>
                {categoryProducts.length === 0 ? (
                    <div className="no-products-placeholder">
                        <p>No products available in this category at the moment. Please check back later!</p>
                    </div>
                ) : (
                    sortProducts().map((product) => (
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
}

export default ShopCategory;