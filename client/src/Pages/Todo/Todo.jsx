import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getalltodo`,
        {
          method: "GET",
          headers: HEADERS,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDelete = async (index, id) => {
    if (!id) {
      setError("Invalid ID provided.");
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_API_ENDPOINT}/deletetodo`, {
        method: "POST",
        headers: HEADERS,
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const newTodos = todos.filter((_, idx) => idx !== index);
      setTodos(newTodos);
    } catch (error) {
      setError(`Error deleting todo: ${error.message}`);
    }
  };

  const handleAdd = async () => {
    if (!inputValue.trim()) {
      setError("Input value cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/createtodo`,
        {
          method: "POST",
          headers: HEADERS,
          credentials: "include",
          body: JSON.stringify({ name: inputValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add TODO");
      }

      const todo = await response.json();
      setTodos([...todos, todo]);
      setInputValue("");
    } catch (error) {
      setError(`Error adding todo: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_ENDPOINT}/logout`, {
        method: "POST",
        credentials: "include",
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
      window.location.reload();
    } catch (error) {
      setError(`Error during logout: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleAdd}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button type="submit">Add Todo</button>
      </form>
      {error && <p>Error: {error}</p>}
      <ul>
        {todos.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          todos.map((todo, index) => (
            <li key={todo._id}>
              {todo.name}
              <button onClick={() => handleDelete(index, todo._id)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      <button id="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default TodoList;
