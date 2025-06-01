import React from 'react';
import './CSS/About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About Me</h1>
                <p>Welcome to Crochet n' Beads!</p>
            </div>
            
            <div className="about-content">
                <div className="about-section">
                    <h2>My Story</h2>
                    <p>I started my small business with nothing but hope and a lot of uncertainty. It hasn’t been easy, but every challenge taught me something great along the way! This journey is about growth, courage, passion and creating something that matters to me.</p>
                </div>
                
                <div className="about-section">
                    <h2>My Mission</h2>
                    <p>My mission is to inspire others through my work and bring joy with every handmade item—each one crafted with love, care, and a personal touch, just for them.</p>
                </div>
            </div>
        </div>
    );
};

export default About;