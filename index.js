import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/Userroutes.js";
import blogRoutes from "./routes/Blogroutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: "https://blogfrontent.onrender.com/",
  })
);
dotenv.config();
app.use(cookieParser());

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
app.use("/api/user", userRoutes);
app.use("/api", blogRoutes);

connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
