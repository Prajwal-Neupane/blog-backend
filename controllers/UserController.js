import mongoose from "mongoose";
import userModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  //   console.log(req.body);
  let existingUser;
  try {
    existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = new userModel({ username, email, password: hashedPassword });
    const response = await user.save();
    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message, // You can include the error message for debugging purposes
    });
  }
};

// LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password" });
    } else {
      const accessToken = jwt.sign(
        {
          id: existingUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 7 * 24 * 60 * 60 * 1000 }
      );
      // const refreshToken = jwt.sign(
      //   {
      //     id: existingUser._id,
      //   },
      //   process.env.REFRESH_TOKEN_SECRET,
      //   { expiresIn: "7d" }
      // );

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

// CREATE A REFRESH TOKEN

// export const refresh = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized from refresh cookies" });
//   }
//   const refreshToken = cookies.jwt;
//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async (err, decoded) => {
//       if (err)
//         return res.status(403).json({ message: "Forbidden from refreshToken" });

//       const user = await userModel.findById(decoded.id);

//       if (!user)
//         return res
//           .status(401)
//           .json({ message: "Unauthorized from refresh token" });
//       const accessToken = jwt.sign(
//         {
//           id: user._id,
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "1m" }
//       );
//       res.json({ accessToken });
//     }
//   );
// };

// LOGOUT A USER

export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

// GET USER

export const getUser = async (req, res) => {
  const user = await userModel.findById(req.user).select("-password");
  res.json(user);
};

// FOLLOW A USER

export const followUser = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  if (id === _id) {
    res.status(403).json({ message: "Action forbidden" });
  } else {
    const followUser = await userModel.findById(id);
    const followingUser = await userModel.findById(_id);

    if (!followUser.followers.includes(_id)) {
      await followUser.updateOne({ $push: { followers: _id } });
      await followingUser.updateOne({ $push: { following: id } });
      res.json({ message: "User followed" });
    } else {
      res.json({ message: "User is already followed" });
    }
  }
};

// UNFOLLOW USER
export const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  if (id === _id) {
    res.status(403).json({ message: "Action forbidden" });
  } else {
    const unfollowUser = await userModel.findById(id);
    const followingUser = await userModel.findById(_id);

    if (unfollowUser.followers.includes(_id)) {
      await unfollowUser.updateOne({ $pull: { followers: _id } });
      await followingUser.updateOne({ $pull: { following: id } });
      res.json({ message: "User unfollowed" });
    } else {
      res.json({ message: "User is not followed by you" });
    }
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const response = await userModel.findById(id).select("username -_id");
  res.json(response);
};
