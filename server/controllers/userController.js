const User = require("../models/User");
const Post = require("../models/Post");
const followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const alreadyFollowing = currentUser.following.includes(targetUserId);
    if (alreadyFollowing) {
      //remove follow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId,
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString(),
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "Unfollowed user",
      });
    }
    // Add follow

    currentUser.following.push(targetUserId);

    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "User followed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username")
      .populate("following", "username")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await Post.find({
      author: user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  followUser,
  getProfile,
};
