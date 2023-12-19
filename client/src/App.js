import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext.js";
import { useContext } from "react";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import TodoList from "./Pages/Todo/Todo";
const App = () => {
  const LoggedIn = useContext(AuthContext);
  console.log(LoggedIn);
  const isLoggedIn = LoggedIn.isLoggedIn;

  return (
    <>
      {isLoggedIn === false && (
        <>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </>
      )}
      {isLoggedIn === true && (
        <Routes>
          <Route path="/*" element={<TodoList />} />
        </Routes>
      )}
    </>
  );
};

export default App;
