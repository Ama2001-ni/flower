import React, { useEffect, useState, } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

const FlowerListing = () => {
  const navigate = useNavigate();

  const [flowerListing, setFlower] = useState([]);

  useEffect(() => {
    fetchDate()
  }, [])

  const fetchDate = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/get-all-flowers`);
      if (response.status == 200) {
        setFlower(response?.data?.data)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let cartArr = [];

  const handleAddtocart = (id) => {
    const newArr = flowerListing.filter((item) => item._id == id)
    cartArr.push(newArr[0]._id)
    localStorage.setItem("cartItems", JSON.stringify(cartArr))
    alert("Product Added to cart")
  }

  return (
    <div className="">
      <Header />

      <div className="container flower-cnt">
        <div className="row">
          <div className="col-md-3 d-flex justify-content-between flex-wrap" style={{ width: "100%" }}>
            {flowerListing.length > 0 ?
              <>
                {flowerListing?.map((item) =>
                  <div className="each-flower">
                    <img src={item.image} style={{ width: "100%", height: 200 }} />
                    <p className="flowerName">{item.title}</p>
                    <p className="flowerName">{item.description}</p>
                    <p className="flowerName">{item.price} OMR</p>
                    <button className="addToCartBtn" onClick={() => handleAddtocart(item._id)}>Add To cart</button>
                  </div>
                )}
              </>
              :
              <div>No listing is availabe to show</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default FlowerListing;
