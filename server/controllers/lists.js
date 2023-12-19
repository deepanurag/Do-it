import TodoModel from "../models/Todo.js";
import UserModel from "../models/UserModel.js";

export const getalltodo = async (req, res) => {
  //const { email } = req.body;
  const email = "test@test";
  try {
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const todos = await TodoModel.find({ _id: { $in: existingUser.todos } });

    return res.status(200).json(todos);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
};

export const createtodo = async (req, res) => {
  const { name } = req.body;
  const email = "test@test";

  try {
    const existingUser = await UserModel.findOne({ email: email });
    const existingtodo = await TodoModel.findOne({ name: name });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (existingtodo) {
      return res.status(404).json({ error: "Same task not allowed" });
    }
    const todo = new TodoModel({
      name: name,
      Users: existingUser._id,
    });

    await todo.save();
    existingUser.todos = existingUser.todos || [];
    existingUser.todos.push(todo._id);

    await existingUser.save();

    res.status(201).json({ message: "TODO created successfully", todo: todo });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to create TODO" });
  }
};

export const deletetodo = async (req, res) => {
  const { _id } = req.body;
  const email = "test@test";

  try {
    // Find the existing todo by its ID
    const existingTodo = await TodoModel.findOne({ _id: _id });

    // Check if existingTodo is null or undefined
    if (!existingTodo) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete the todo
    await TodoModel.deleteOne({ _id: _id });

    // Remove the todo reference from the user
    const user = await UserModel.findOne({ email: email });
    if (user) {
      user.todos.pull(existingTodo._id);
      await user.save();
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
