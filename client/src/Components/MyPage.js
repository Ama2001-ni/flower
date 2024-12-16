import React, { useState, useEffect } from "react";
import Axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const [data, setDate] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLoggedIn")
    if (isLogin) {
      fetchData();
    }
    else {
      navigate("/login")
    }
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const response = await Axios.post(`http://localhost:8000/get-all-purchased-flowers`, {
        userId
      });
      const totalPrice = response.data.Flowers.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(totalPrice)
      setDate(response.data.Flowers)
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="">
      <Header />
      <div className="container flower-cnt">
        <div className="row">
          <div className="col-sm-12">
            {data.length > 0 ?
              <div className="postion-relative">
                {data?.map((item) =>
                  <div className="my-flower">
                    <img src={item.image} className="mypage-img" />
                    <div className="d-flex justify-content-between">
                      <p className="flowerTitle">Title: </p><p className="flowerName">{item.title}</p>
                    </div>
                  </div>
                )}
                {totalPrice &&
                  <div className="d-flex total-price">
                    <p>Total:</p><p>{totalPrice} RO</p>
                  </div>
                }
              </div>
              :
              <div>No purchased flower yet, please buy any</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyPage;
