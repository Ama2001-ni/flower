import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import MyPage from "./Components/MyPage";
import FlowerListing from "./Components/FlowerListing";
import AddFlower from "./Components/AddFlower";
import Cart from "./Components/Cart";
import Success from "./Components/Success";
const App = () => {
  return (
    <div>
      <Router>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/flowers" element={<FlowerListing />}></Route>
            <Route path="/add-flower" element={<AddFlower />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/Success" element={<Success />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/mypage" element={<MyPage />}></Route>
          </Routes>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default App;
