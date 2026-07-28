const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      image,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username bio")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      //remove like
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        likes: post.likes.length,
      });
    }

    //add like
    post.likes.push(userId);

    await post.save();

    res.status(200).json({
      message: "Post liked",
      likes: post.likes.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createPost,
  getPosts,
  likePost,
};
