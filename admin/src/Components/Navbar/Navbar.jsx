import React from 'react';
import './Navbar.css';
import logo from '../../Assets/logoimg.png';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <Link to="/admin" className="navbar-logo">
                <img src={logo} alt="Logo" />
                <p>crochet n' beads! – Admin Page</p>
            </Link>
        </div>
    );
};

export default Navbar;