import blogModel from "../models/Blog.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().sort({ createdAt: "desc" });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  const { content, thumbnail, hashtags } = req.body;

  const createBlog = await blogModel.create({
    content,
    author: req.user._id,
    thumbnail,
    hashtags,
  });

  const response = await createBlog.save();
  return res.json(response);
};

export const getBlogsOfLoggedInUser = async (req, res) => {
  const response = await blogModel
    .find({ author: req.user._id })
    .sort({ createdAt: "desc" });
  res.json(response);
};
export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  const response = await blogModel.findById(id);
  res.json(response);
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const post = await blogModel.findById(id);
  if (!post.likes.includes(_id)) {
    await post.updateOne({ $push: { likes: _id } });
    res.json("Post Liked");
  } else {
    await post.updateOne({ $pull: { likes: _id } });
    res.json("Post unliked");
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { commentText } = req.body;

    const post = await blogModel.findById(id);
    if (!post) {
      res.json({ message: "Post not found" });
    }
    const newComment = {
      userId: _id,
      comment: commentText,
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.json({ message: "Error occured" });
  }
};

export const getBlogsOfFollowedUser = async (req, res) => {
  try {
    const followedUserId = req.user.following;

    const blogs = await blogModel.find({ author: { $in: followedUserId } });
    res.json(blogs);
  } catch (error) {
    res.json({ message: "error while fetching the data" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, thumbnail, hashtags } = req.body;

    const response = await blogModel.findOneAndUpdate(
      { _id: id },
      {
        content,
        thumbnail,
        hashtags,
      }
    );
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};
