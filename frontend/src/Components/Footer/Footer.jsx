import React from 'react';
import './Footer.css'
import logowtxt from "../Assets/logotxt.png";
import instagram from "../Assets/instagram.png";
import tiktok from "../Assets/tiktok.png";

const Home = () => {
    return (
        <div className='footer'>
            <div className='footer-logo'>
                <img src={logowtxt} alt='Logo'/>
            </div>
            <div className='footer-menu'>
                <li><a href='/'>Home</a></li>
                <li><a href='/plushies'>Plushies</a></li>
                <li><a href='/apparel'>Apparel</a></li>
                <li><a href='/bouquets'>Bouquets</a></li>
                <li><a href='/jewelry'>Jewelry</a></li>
            </div>
            <div className='footer-socials'>
                <a href='https://www.instagram.com/crochet.n.beads' rel='noopener noreferrer'><img src={instagram} alt='Instagram'/></a>
                <a href='https://www.tiktok.com/@crochet.n.beads.ae' rel='noopener noreferrer'><img src={tiktok} alt='Tiktok'/></a>
            </div>
            <div className='footer-copyright'>
                <p>&copy; 2023 crochet n' beads! All rights reserved.</p>
            </div>
        </div>
    )
}

export default Home;