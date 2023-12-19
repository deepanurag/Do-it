import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
        // Make a POST request to the login endpoint using Axios
        const response = await fetch(`http://localhost:8000/login`, {
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
        });
        const data = await response.json();
        if (response.status === 200) {
          // console.log("loggedin");
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
    <div className="right-section">
      <h2 className="right">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <button type="submit">Login</button>
        <br />
        <div className="Account">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
