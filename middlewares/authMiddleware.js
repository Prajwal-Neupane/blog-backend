import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

const checkIsUserAuthenticated = async (req, res, next) => {
  let token;
  try {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      // Verify Token

      //   id comes from the loginController
      const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Get User from Token
      req.user = await userModel.findById(id).select("username email _id");
      // console.log(req.user);

      next();
    } else {
      res.status(401).json({
        message: "User not authorized from authMiddleware",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Failed to authorize from middleware catch",
      error: error.message, // You can include the error message for debugging purposes
    });
  }
};

export default checkIsUserAuthenticated;
