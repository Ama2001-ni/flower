import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);
  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
    window.location.reload()
  }
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    setLoginStatus(isLoggedIn)
  }, [])
  return (
    <div className="header">
      <nav class="nav">
        <a className="flower-heading" href="/">
          Flower
        </a>
        <Link className="nav-link" to="/">
          Home
        </Link>
        {!loginStatus &&
          <Link className="nav-link" to="/login">
            Login
          </Link>
        }
        <Link className="nav-link" to="/flowers">
          Product
        </Link>
        <Link className="nav-link" to="/add-flower">
          Add Flower
        </Link>
        <Link className="nav-link" to="/mypage">
          My Page
        </Link>
        <Link className="nav-link" to="/cart">
          Cart
        </Link>
        {loginStatus &&
          <Link className="nav-link" onClick={handleLogout}>
            Logout
          </Link>
        }

      </nav>
    </div>
  );
};

export default Header;
