import React, { useState } from "react";
import Axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const AddFlower = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToDisplay, setImagetoDisplay] = useState(null);

  const [errMsg, setErrMsg] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });


  const submitHandler = async () => {
    errMsg["title"] = false
    errMsg["description"] = false
    errMsg["price"] = false
    errMsg["image"] = false

    if (data.title == "") {
      setErrMsg({ ...errMsg, title: true })
      return;
    }
    if (data.description == "") {
      setErrMsg({ ...errMsg, description: true })
      return;
    }
    if (data.price == "") {
      setErrMsg({ ...errMsg, price: true })
      return;
    }
    if (!selectedImage) {
      setErrMsg({ ...errMsg, image: true })
      return;
    }

    let formData = new FormData();

    formData.append('title', data.title);
    formData.append('image', selectedImage);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));


    try {
      const response = await Axios.post('http://localhost:8000/add-flower', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == 200) {
        //success
        setData({
          title: "",
          description: "",
          price: "",

        });
        setSelectedImage(null);
        setImagetoDisplay(null)
        alert("Flower created successfully");
        navigate("/flowers")
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
      console.error("Error fetching data:", error);
    }
  }

  const handleOnChnage = (e) => {
    const value = e.target.value
    const name = e.target.name
    setData({ ...data, [name]: value })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagetoDisplay(imageUrl)
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagetoDisplay(null)
  };

  return (
    <div className="">
      <div>
        <Header />
        <div className="container justify-content-center d-flex">
          <div className="row">
            <div className="col-sm-12">
              <div className="login-cnt">
                <p className="login-heading">Enter flower Information</p>
                <div className="mb-10">
                  <div className="d-flex">
                    <label>Title:</label>
                    <input type="text" value={data.title} onChange={handleOnChnage} name="title" className="usernameinput" />
                  </div>
                  {errMsg.title && <span className="err-msg">Title  is required</span>}
                </div>
                <div className="mb-10">
                  <div className="d-flex">
                    <label>Description:</label>
                    <input type="text" value={data.description} onChange={handleOnChnage} name="description" className="passwordinput" />
                  </div>
                  {errMsg.description && <span className="err-msg">Description  is required</span>}
                </div>
                <div className="mb-10">
                  <div className="d-flex mb-10">
                    <label>Price</label>
                    <input type="text" value={data.price} onChange={handleOnChnage} name="price" className="passwordinput" />
                  </div>
                  {errMsg.price && <span className="err-msg">Price  is required</span>}
                </div>

                <div className="image-picker-container">
                  {imageToDisplay ? (
                    <div className="image-preview">
                      <img src={imageToDisplay} alt="Selected" />
                      <button className="remove-button" onClick={removeImage}>Remove</button>
                    </div>
                  ) : (
                    <label className="image-input-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      Choose an Image
                    </label>
                  )}
                  {errMsg.image && <span className="err-msg">Image  is required</span>}
                </div>
                <button className="loginBtn" onClick={submitHandler}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
export default AddFlower;
