
import pic1 from "../Images/img2.jpg";
import React from "react";
import Header from "./Header";

const Home = () => {
    return (
        <div className="home">
            <Header />
            <img  src={pic1} className="home-page-banner"/>
            <h3 className="home-heading">Fresh and beautiful flowers</h3>
        </div>
    );
};

export default Home;

 