import React, { useEffect, useState } from "react";
import Axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const navigate = useNavigate();
  const [flowerListing, setFlower] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    fetchDate()
  }, [])

  const fetchDate = async () => {
    const cartItems = localStorage.getItem("cartItems") || []
    try {
      const response = await Axios.get(`http://localhost:8000/get-all-flowers`);
      if (response.status == 200) {
        const matchedObjects = response?.data?.data.filter(item => cartItems.includes(item._id));
        const totalPrice = matchedObjects.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(totalPrice)
        setFlower(matchedObjects)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onDeleteClick = (id) => {
    const newArr = flowerListing.filter((item) => item._id != id)
    const idsArray = newArr.map(item => item._id);
    setFlower(newArr)
    localStorage.setItem("cartItems", idsArray)
  }

  const submitHandler = async () => {
    const userId = localStorage.getItem("userId")
    const flowerList = flowerListing.map(item => item._id);
    try {
      const response = await Axios.post(`http://localhost:8000/buy-flower`, {
        userId,
        flowerIds: flowerList
      });
      if (response.status == 200) {
        localStorage.removeItem("cartItems")
        navigate("/Success")
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
      console.error("Error fetching data:", error);
    }
  }


  return (
    <div className="">
      <Header />

      <div className="container position-relative">
        <div className="row">
          {flowerListing.length > 0 &&
            <p className="total-price">Your cart</p>
          }
          {flowerListing.length > 0 ?
            <>
              {flowerListing.map((item) =>
                <div className="col-sm-12 d-flex align-items-center justify-content-around mb-10">
                  <img src={item.image} className="cart-flower-img" />
                  <div>
                    <p className="cart-title">{item.title}</p>
                    <p className="cart-title">{item.price} RO</p>
                  </div>
                  <button className="delete-item-cart" onClick={() => onDeleteClick(item._id)}>Delete</button>
                </div>
              )}
            </>
            :
            <div className="total-price">Your cart is empty</div>
          }
        </div>
        {flowerListing.length > 0 &&
          <div className="cartActions">
            <span className="total-price">Total: {totalPrice} RO</span>
            <button className="place-order-btn" onClick={submitHandler}>Place order</button>
          </div>
        }
      </div>
    </div >
  );
};
export default Cart;
