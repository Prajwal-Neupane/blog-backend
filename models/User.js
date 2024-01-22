import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
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
    profilePic: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1705826178~exp=1705826778~hmac=98e75a7c07444db2ab18318e3464f2b065212c2580fa463b0f97476bf9e8413f",
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
