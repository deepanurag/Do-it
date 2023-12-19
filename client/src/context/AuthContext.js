import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getLoggedIn() {
      try {
        console.log("dikghklfgjk");
        const response = await axios.get("http://localhost:8000/loggedIn", {
          withCredentials: true,
        });

        setIsLoggedIn(response.data.isLoggedIn);
      } catch (err) {
        setError(err.message || "Failed to fetch login status");
      } finally {
        setIsLoading(false);
      }
    }

    getLoggedIn();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
