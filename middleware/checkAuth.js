const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkAuth = async (req, res, next) => {
  let autorization = req.headers.authorization;
  const token =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');

  if (autorization && token) {
    try {
      autorization = autorization.split(' ')[1];

      const decoded = jwt.verify(autorization, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select(
        '-password -__v -confirm -token -createdAt -updatedAt'
      );
    } catch (error) {
      console.log(error);
    }
  }

  if (!autorization) {
    return res.status(401).json({
      msg: 'Not authorized',
    });
  }

  next();
};

module.exports = checkAuth;
