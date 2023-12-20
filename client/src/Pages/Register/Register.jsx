import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import icon from "../Login/check.png";
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (name.trim() === "") {
      hasError = true;
    }

    if (email.trim() === "") {
      hasError = true;
    }

    if (password.trim() === "") {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        navigate("/login");
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.log("Error occurred:", error);
    }
    setName("");
    setEmail("");
    setPassword("");
    console.log("registered");
  };

  return (
    <div className="login-page container">
      <div className="left-section"></div>

      <div className="right-section">
        <div className="center-image">
          <img src={icon}></img>
        </div>
        <h2 className="right">Signup</h2>
        <p>
          Please Fill in your Name, Email and password
          <br /> to create a new account
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
          <div className="password-box">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="password-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <br />
          <button className="button1" type="submit">
            Create Account
          </button>
          <br />
          <div className="Account">
            Already have an account?
            <Link to="/">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
