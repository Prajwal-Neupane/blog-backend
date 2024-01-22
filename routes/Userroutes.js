import express from "express";
import {
  followUser,
  getAllUsers,
  getUser,
  getUserById,
  loginUser,
  logout,
  registerUser,
  unfollowUser,
} from "../controllers/UserController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", checkIsUserAuthenticated, getUser);
router.put("/follow/:id", checkIsUserAuthenticated, followUser);
router.put("/unfollow/:id", checkIsUserAuthenticated, unfollowUser);
// router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/getuser/:id", getUserById);
router.get("/allusers", getAllUsers);

export default router;
