import express from "express";
import {
  commentPost,
  createBlog,
  getAllBlogs,
  getBlogsOfLoggedInUser,
  likePost,
} from "../controllers/BlogController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/blogs", getAllBlogs);
router.post("/addblog", checkIsUserAuthenticated, createBlog);
router.get("/userblogs", checkIsUserAuthenticated, getBlogsOfLoggedInUser);
router.put("/like/:id", checkIsUserAuthenticated, likePost);
router.post("/comment/:id", checkIsUserAuthenticated, commentPost);
router.get("/timeline", checkIsUserAuthenticated, getBlogsOfLoggedInUser);

export default router;
