import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    tc: {
      type: Boolean,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refer: "users",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refer: "users",
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
