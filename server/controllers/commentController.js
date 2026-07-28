const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    console.log("Create comment route reached");
    console.log("User:", req.user);
    console.log("Post ID:", req.params.postId);
    console.log("Body:", req.body);

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }
    const comment = await Comment.create({
      author: req.user._id,
      post: req.params.postId,
      text,
    });
    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createComment,
  getComments,
};
