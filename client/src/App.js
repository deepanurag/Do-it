// App.js
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.js";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import TodoList from "./Pages/Todo/Todo";

const App = () => {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn);
  return (
    <Routes>
      {isLoggedIn === false && (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Login />} />
        </>
      )}
      {isLoggedIn === true && <Route path="/*" element={<TodoList />} />}
    </Routes>
  );
};

export default App;
