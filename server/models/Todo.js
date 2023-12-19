import { Schema, model } from "mongoose";

const todoSchema = new Schema({
  name: { type: String },
  todos: [{ type: Schema.Types.ObjectId, ref: "UserModel" }],
});

const TodoModel = model("Todo", todoSchema);

export default TodoModel;
