import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Use cors middleware with specific options
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.log(err.message));

app.use("/", routes);
