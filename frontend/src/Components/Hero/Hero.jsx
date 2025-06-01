import React from "react";
import "./Hero.css";
import heroVideo from "../Assets/cnbbgvideo.mp4"; 

const Hero = ({ scrollToPopular }) => {
    return (
        <div className="hero">
            <video autoPlay loop muted className="hero-video">
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>Welcome to crochet 'n beads!</h1>
                <p>Need some plushies? Maybe some accessories? Apparel? or a bouquet for a special someone? Check out the store!</p>
                <button className="hero-shopnow" onClick={scrollToPopular}>Shop Now</button>
            </div>
        </div>
    )
}

export default Hero;