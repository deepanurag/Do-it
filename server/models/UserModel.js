import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

const UserModel = model("User", userSchema);

export default UserModel;
