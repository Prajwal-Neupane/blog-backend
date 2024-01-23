import express from "express";
import {
  commentPost,
  createBlog,
  getAllBlogs,
  getBlogsOfLoggedInUser,
  getSingleBlog,
  likePost,
  updateBlog,
} from "../controllers/BlogController.js";
import checkIsUserAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/blogs", getAllBlogs);
router.post("/addblog", checkIsUserAuthenticated, createBlog);
router.get("/userblogs", checkIsUserAuthenticated, getBlogsOfLoggedInUser);
router.put("/like/:id", checkIsUserAuthenticated, likePost);
router.post("/comment/:id", checkIsUserAuthenticated, commentPost);
router.get("/timeline", checkIsUserAuthenticated, getBlogsOfLoggedInUser);
router.get("/blog/:id", checkIsUserAuthenticated, getSingleBlog);
router.put("/blog/:id", checkIsUserAuthenticated, updateBlog);

export default router;
