import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";
const AuthContext = createContext();

function AuthContextProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    async function getLoggedIn() {
      try {
        const response = await axios.get(`http://localhost:8000/loggedIn`, {
          withCredentials: true,
        });
        console.log(response.data);
        setIsLoggedIn(response.data);
      } catch (error) {
        console.error("Error checking logged in status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    getLoggedIn();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}

export { AuthContextProvider, useAuth };

export default AuthContext;
