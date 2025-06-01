import React from 'react';
import './Breadcrumb.css';
import rightarrow from '../Assets/rightarrow.png';

const Breadcrumb = (props) => {
    const { item } = props;

    if (!item) {
        return null;
    }

    return (
        <div className='breadcrumb'>
            Home 
            <img src={rightarrow} className="rightarrow" alt="arrow" /> 
            {item.category} 
            <img src={rightarrow} className="rightarrow" alt="arrow" /> 
            {item.name}
        </div>
    );
}

export default Breadcrumb;