import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Login.css';
import icon from './check.png';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() !== "" && password.trim() !== "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/login`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          window.location.href = "/";
        } else {
          alert(data.message);
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
      setEmail("");
      setPassword("");
    }
    console.log("Submitted");
  };

  return (
    <div className="container">
    <div className="right-section">
      <div className="center-image">
      <img src={icon}></img>
      </div>
      <h2 className="right">Login</h2>
      <p>Please Enter your email and password</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
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
        <button className="button1" type="submit">Login</button>
        <div className="Account">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
