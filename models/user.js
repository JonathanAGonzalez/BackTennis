const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },
    token: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
