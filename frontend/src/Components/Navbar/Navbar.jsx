import React, { useState, useContext, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logoimg.png';
import shoppingBag from '../Assets/shopping-bag.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import dropdown from '../Assets/dropdown.png';

const Navbar = () => {
  const [menu, setMenu] = useState('shop');
  const {getTotalCartProducts} = useContext(ShopContext);
  const menuRef = useRef();

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  const dropdowntoggle = (e) => {
    menuRef.current.classList.toggle('navbar-active');
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
        <Link to='/' className='navbar-logo' onClick={handleNavClick}>
            <img src={logo} alt='Logo'/>
            <p>crochet n' beads!</p>
        </Link>
        <img className='navbar-dropdown' onClick={dropdowntoggle} src={dropdown} alt=""/>
        <div ref={menuRef} className='navbar-menu'>
            <li onClick={()=>{setMenu('plushies'); handleNavClick();}}><Link style={{textDecoration:'none'}} to='/plushies'>Plushies</Link>{menu==='plushies'}</li>
            <li onClick={()=>{setMenu('apparel'); handleNavClick();}}><Link style={{textDecoration:'none'}} to='/apparel'>Apparel</Link>{menu==='apparel'}</li>
            <li onClick={()=>{setMenu('bouquets'); handleNavClick();}}><Link style={{textDecoration:'none'}} to='/bouquets'>Bouquets</Link>{menu==='bouquets'}</li>
            <li onClick={()=>{setMenu('jewelry'); handleNavClick();}}><Link style={{textDecoration:'none'}} to='/jewelry'>Jewelry</Link>{menu==='jewelry'}</li>
            <li onClick={()=>{setMenu('about'); handleNavClick();}}><Link style={{textDecoration:'none'}} to='/about'>About</Link>{menu==='about'}</li>
        </div>
        <div className='navbar-cart'>
            {localStorage.getItem('token') 
            ? <button onClick={() => {localStorage.removeItem('token'); window.location.replace('/')}}>Log Out</button> 
            : <Link to='/login' onClick={handleNavClick}><button>Sign Up</button></Link>}
            <Link to='/cart' onClick={handleNavClick}><img src={shoppingBag} alt='Cart'/></Link>
            <div className='navbar-cartcount'>{getTotalCartProducts()}</div>
        </div>
    </div>
  );
}

export default Navbar;