const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  confirmToken,
  forgetPassword,
  changeToNewPassword,
  checkToken,
  profile,
} = require('../controllers/users');

const checkAuth = require('../middleware/checkAuth');

router.post('/create-user', createUser);

router.get('/profile', checkAuth, profile);

router.post('/login', loginUser);
router.get('/confirm-acount/:token', confirmToken);

router.post('/forget-password', forgetPassword);

router.get('/forget-password/:token', checkToken);
router.post('/forget-password/:token', changeToNewPassword);

module.exports = router;
