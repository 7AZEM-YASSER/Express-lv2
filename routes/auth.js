const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/User");

router.post("/register", async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  try {
    const userCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      return res.status(400).json({ message: "this user already register" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    let user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const result = await user.save();
    const token = JWT.sign(
      { id: result._id, isAdmin: result.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.details[0].message });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  const userEmailCheck = await User.findOne({ email: req.body.email });
  if (!userEmailCheck) {
    return res.status(400).json({ message: "invalid email or pass" });
  }

  const userPassCheck = await bcrypt.compare(
    req.body.password,
    userEmailCheck.password
  );
  if (!userPassCheck) {
    return res.status(400).json("invalid email or pass");
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const token = JWT.sign(
    { id: userEmailCheck._id, isAdmin: userEmailCheck.isAdmin },
    process.env.JWT_SECRET_KEY
  );
  const { password, ...other } = userEmailCheck._doc;
  res.status(201).json({ ...other, token });
});

module.exports = router;
