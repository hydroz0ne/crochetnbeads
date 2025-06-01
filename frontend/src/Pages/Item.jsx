import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Item = () => {
    const { all_products } = useContext(ShopContext);
    const { itemid } = useParams();
    const item = all_products.find((e) => e.id === Number(itemid));

    return (
        <div>
            <Breadcrumb item={item} />
            <ProductDisplay item={item} />
            <RelatedProducts item={item} />
        </div>
    );
};

export default Item;