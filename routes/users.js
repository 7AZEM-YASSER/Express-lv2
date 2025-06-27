const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  verifyToknAndAuthorization,
  verifyToknAndAdmin,
} = require("../middlewares/verifyToken");
const { User, validateUpdateUser } = require("../models/User");

router.put("/:id", verifyToknAndAuthorization, async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const checkId = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json(checkId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.details[0].message });
  }
});

router.get("/", verifyToknAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.details[0].message });
  }
});

router.get("/:id", verifyToknAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(400).json({message: "user in not found"});
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.details[0].message });
  }
});

router.delete("/:id", verifyToknAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(400).json({message: "user in not found"});
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "user has been deleted"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.details[0].message });
  }
});

module.exports = router;
