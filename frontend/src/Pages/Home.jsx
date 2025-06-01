import React, { useRef } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import NewProducts from '../Components/NewProducts/NewProducts';

const Home = () => {

    const popularRef = useRef(null);

    const scrollToPopular = () => {
        popularRef.current?.scrollIntoView();
    };

    return (
        <div>
            <Hero scrollToPopular={scrollToPopular} />
            <Popular ref={popularRef} />
            <NewProducts />
        </div>
    )
}

export default Home;