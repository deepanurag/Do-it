import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);
  const navigate = useNavigate();
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/getalltodo");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(
        "There was a problem fetching the TODO list:",
        error.message
      );
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDelete = async (index, id) => {
    console.log("Deleting TODO with ID:", id);

    if (!id) {
      console.error("Invalid ID provided.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/deletetodo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
      } else {
        throw new Error("Failed to delete TODO");
      }
    } catch (error) {
      console.error("There was a problem deleting the TODO:", error.message);
    }
  };
  const handleadd = async () => {
    try {
      const response = await fetch("http://localhost:8000/createtodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to add TODO");
      }

      const todo = await response.json();
      setTodos([...todos, todo]);
      setInputValue("");
    } catch (error) {
      console.error("There was a problem adding the TODO:", error.message);
    }
  };
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleadd}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button>Add Todo</button>
      </form>
      {error && <p>Error: {error}</p>}
      <ul>
        {todos.map((todo, index) => (
          <li key={todo._id}>
            {todo.name}
            <button onClick={() => handleDelete(index, todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button id="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default TodoList;
