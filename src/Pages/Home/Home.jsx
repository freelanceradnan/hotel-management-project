import React from "react";
import { assets, cities } from "../../assets/assets";
import FeatureDestination from "../../Components/FeatureDestination/FeatureDestination";
import ExclusiveOffer from "../../Components/ExclusiveOffer/ExclusiveOffer";
import Hero from "../../Components/HeroSection/Hero";
import Testimonial from "../../Components/Testimonial/Testimonial";

const Home = () => {
  return (
    <>
        <Hero/>
        <FeatureDestination/>
        <ExclusiveOffer/>
        <Testimonial/>
    </>
  );
};

export default Home;
