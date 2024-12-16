import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchemaValidation } from "../Validations/UserValidations";
import * as yup from "yup";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Logo from "../Images/logo.jpg";
const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  const [errMsg, setErrMsg] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    matchPassowrd: "",
  });

  useEffect(() => {
    const isLogin = localStorage.getItem("isLoggedIn");
    if (isLogin) {
      navigate("/");
    }
  }, []);

  const submitHandler = async (e) => {
    errMsg["username"] = false;
    errMsg["email"] = false;
    errMsg["password"] = false;
    errMsg["confirmPassword"] = false;
    errMsg["matchPassowrd"] = false;
    e.preventDefault();

    if (data.username == "") {
      setErrMsg({ ...errMsg, username: true });
      return;
    }
    if (data.email == "") {
      setErrMsg({ ...errMsg, email: true });
      return;
    }
    if (data.password == "") {
      setErrMsg({ ...errMsg, password: true });
      return;
    }
    if (data.confirmPassword == "") {
      setErrMsg({ ...errMsg, confirmPassword: true });
      return;
    }

    if (data.confirmPassword != data.password) {
      setErrMsg({ ...errMsg, matchPassowrd: true });
      return;
    }

    try {
      const response = await Axios.post(`http://localhost:8000/register`, {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (response.status == 201) {
        //user created successfully
        navigate("/login");
        alert("user created successfully");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "something went wrong"
      );
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleOnChnage = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="">
      <div>
        <Header />
        <div className="container justify-content-center d-flex">
          <div className="row">
            <div className="col-sm-12">
              <img src={Logo} className="flower-logo" />

              <div className="login-cnt">
                <p className="login-heading">Create your account</p>
                <div className="mb-10">
                  <div className="d-flex">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={data.username}
                      onChange={handleOnChnage}
                      name="username"
                      className="usernameinput"
                    />
                  </div>
                  {errMsg.username && (
                    <span className="err-msg">Username is required</span>
                  )}
                </div>
                <div className="mb-10">
                  <div className="d-flex">
                    <label>Email:</label>
                    <input
                      type="text"
                      value={data.email}
                      onChange={handleOnChnage}
                      name="email"
                      className="passwordinput"
                    />
                  </div>
                  {errMsg.email && (
                    <span className="err-msg">Email is required</span>
                  )}
                </div>
                <div>
                  <div className="d-flex mb-10">
                    <label>Password:</label>
                    <input
                      type="text"
                      value={data.password}
                      onChange={handleOnChnage}
                      name="password"
                      className="passwordinput"
                    />
                  </div>
                  {errMsg.password && (
                    <span className="err-msg">Password is required</span>
                  )}
                </div>

                <div className="mb-10">
                  <div className="d-flex">
                    <label>Confirm Passowrd:</label>
                    <input
                      type="text"
                      value={data.confirmPassword}
                      onChange={handleOnChnage}
                      name="confirmPassword"
                      className="passwordinput"
                    />
                  </div>
                  {errMsg.confirmPassword && (
                    <span className="err-msg">
                      Confirm Passowrd is required
                    </span>
                  )}
                  {errMsg.matchPassowrd && (
                    <span className="err-msg">
                      Confirm Passowrd should match with password
                    </span>
                  )}
                </div>

                <button onClick={submitHandler} className="loginBtn">
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
