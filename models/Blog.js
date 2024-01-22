import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refer: "users",
    },
    thumbnail: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refer: "users",
      },
    ],
    hashtags: [String],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refer: "users",
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", blogSchema);
export default blogModel;
