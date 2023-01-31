const emailConfirmUser = require('../helpers/emailConfirmUser');
const emailForgetPassword = require('../helpers/emailForgetPassword');

const generateID = require('../helpers/generateID');
const generateJWT = require('../helpers/generateJWT');

const User = require('../models/user');

const createUser = async (req, res) => {
  const { email, password, name } = req.body;

  const userExist = await User.findOne({ email });

  try {
    if (userExist) {
      return res.status(400).json({
        msg: 'El correo electronico ya esta asociado a una cuenta',
      });
    }

    if (email === '' || password === '' || name === '') {
      return res.status(400).json({
        msg: 'Por favor complete los campos',
      });
    }

    const user = new User(req.body);
    user.token = generateID();
    const newUser = await user.save();
    emailConfirmUser({
      email: newUser.email,
      name: newUser.name,
      token: newUser.token,
    });

    res.status(201).json({ msg: 'Usuario creado!', newUser });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //User not found
  if (!user) {
    return res.status(400).json({
      msg: 'User not found',
    });
  }

  //User not confirmed
  if (!user.confirm) {
    return res.status(403).json({
      msg: 'User not confirmed',
    });
  }

  //User compare password
  if (await user.comparePassword(password)) {
    return res.json({
      msg: 'User logged in',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateJWT(user._id),
      },
    });
  } else {
    return res.status(400).json({
      msg: 'Password incorrect',
    });
  }
};

const confirmToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });

  if (!user) {
    return res.status(400).json({
      msg: 'Token not found',
    });
  }

  try {
    user.confirm = true;
    user.token = '';

    await user.save();

    res.json({
      msg: 'User confirmed',
    });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const tokenValid = await User.findOne({ token });
  if (!tokenValid) {
    return res.status(400).json({
      msg: 'Token not found',
    });
  }
  res.json({
    msg: 'Token valid',
  });
};

const forgetPassword = async (req, res) => {
  const { email, name } = req.body;
  console.log(email);

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      msg: 'User not found',
    });
  }

  user.token = generateID();
  await user.save();

  emailForgetPassword({
    email,
    name,
    token: user.token,
    confirmHref: `${process.env.FRONTEND_URL}/user/forget-password/${user.token}`,
  });

  return res.status(200).json({
    msg: 'Email sent',
  });
};

const changeToNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (!password) {
    return res.status(400).json({
      msg: 'Password is required',
    });
  }

  if (!user) {
    return res.status(400).json({
      msg: 'Error en el token',
    });
  }

  user.password = password;
  user.token = '';

  await user.save();

  res.json({
    msg: 'Su password fue cambiado con éxito',
  });
};

const profile = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    msg: 'User Autenticated',
    user,
  });
};

module.exports = {
  createUser,
  loginUser,
  confirmToken,
  checkToken,
  forgetPassword,
  changeToNewPassword,
  profile,
};
