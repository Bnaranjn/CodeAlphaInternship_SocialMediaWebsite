const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    //if authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //get token from bearer token
      token = req.headers.authorization.split(" ")[1];
      //verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({
        message: "Not authorized. No token.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};
module.exports = {
  protect,
};
