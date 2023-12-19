import TodoModel from "../models/Todo.js";
import UserModel from "../models/UserModel.js";

export const getalltodo = async (req, res) => {
  try {
    const existingUser = res.user;
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
  const email = res.user.email;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      console.error("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }
    const existingTodo = await TodoModel.findOne({ name: name });
    if (existingTodo) {
      console.error("TODO with the same name already exists:", name);
      return res.status(400).json({ error: "TODO already exists" });
    }
    const todo = new TodoModel({
      name: name,
      Users: existingUser._id,
    });

    await todo.save();
    existingUser.todos = existingUser.todos || [];
    existingUser.todos.push(todo._id);
    await existingUser.save();
    res.status(201).json({ message: "TODO created successfully", todo });
  } catch (error) {
    console.error("Error occurred while creating TODO:", error);
    res.status(500).json({ error: "Failed to create TODO" });
  }
};
export const deletetodo = async (req, res) => {
  const { id } = req.body;
  const email = res.user.email;
  try {
    const existingTodo = await TodoModel.findOne({ _id: id });
    if (!existingTodo) {
      return res.status(404).json({ error: "Task not found" });
    }
    await TodoModel.deleteOne({ _id: id });
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
