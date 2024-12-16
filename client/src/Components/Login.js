import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Logo from "../Images/logo.jpg";

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const [errMsg, setErrMsg] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        const isLogin = localStorage.getItem("isLoggedIn")
        if (isLogin) {
            navigate("/")
        }
    }, [])


    const handleOnChnage = (e) => {
        const value = e.target.value
        const name = e.target.name
        setData({ ...data, [name]: value })
    }

    const submitHandler = async (e) => {
        errMsg["username"] = false
        errMsg["password"] = false
        e.preventDefault();
        if (data.username == "") {
            setErrMsg({ ...errMsg, username: true })
            return;
        }
        if (data.password == "") {
            setErrMsg({ ...errMsg, password: true })
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/login`, {
                username: data.username,
                password: data.password,
            });
            if (response.status == 200) {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("userId", response.data.user._id);
                setData({
                    username: "",
                    password: "",
                });
                navigate("/mypage")
                alert("loggedIn successfully")
            }
        } catch (error) {
            alert(error.response?.data?.message || error.message || "something went wrong")
            console.error("Error:", error.response?.data?.message || error.message);
        }
    };
    return (
        <div>
            <Header />
            <div className="container justify-content-center d-flex">
                <div className="row">
                    <div className="col-sm-12">
                        <img src={Logo} className="flower-logo" />

                        <div className="login-cnt">

                            <p className="login-heading">Login</p>
                            <div className="mb-10">
                                <div className="d-flex">
                                    <label>UserName:</label>
                                    <input type="text" value={data.username} onChange={handleOnChnage} name="username" className="usernameinput" />
                                </div>
                                {errMsg.username && <span className="err-msg">Username is required</span>}
                            </div>

                            <div className="mb-10">
                                <div className="d-flex">
                                    <label>Passowrd:</label>
                                    <input type="text" value={data.password} onChange={handleOnChnage} name="password" className="passwordinput" />
                                </div>
                                {errMsg.password && <span className="err-msg">Passowrd is required</span>}
                            </div>
                            <button className="loginBtn" onClick={submitHandler}>Login</button>
                            <span className="if-you">Don't have account:<Link className="signupbtn" to={"/signup"} >Create an account</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
