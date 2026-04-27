import React from "react";
import { assets, cities } from "../../assets/assets";
import FeatureDestination from "../../Components/FeatureDestination/FeatureDestination";
import ExclusiveOffer from "../../Components/ExclusiveOffer/ExclusiveOffer";
import Hero from "../../Components/HeroSection/Hero";
import Testimonial from "../../Components/Testimonial/Testimonial";
import Newsletter from "../../Components/Newsletter/Newsletter";
import Footer from "../../Components/Footer/Footer";

const Home = () => {
  return (
    <>
        <Hero/>
        <FeatureDestination/>
        <ExclusiveOffer/>
        <Testimonial/>
        <Newsletter/>
        
    </>
  );
};

export default Home;
