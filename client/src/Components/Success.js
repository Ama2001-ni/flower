import React from "react";
import Header from "./Header";
import Logo from "../Images/logo.jpg";
const Success = () => {
    return (
        <div>
            <Header />
            <img src={Logo} className="flower-logo" />

            <p className="success-order">Order placed successfully</p>
        </div>
    );
};
export default Success;
