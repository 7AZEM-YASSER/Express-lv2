const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

function validateRegisterUser(obj) {
    const Schema = Joi.object({
        email: Joi.string().trim().required(),
        username: Joi.string().trim().min(2).max(20).required(),
        password: Joi.string().trim().min(8).required(),
    })

    return Schema.validate(obj);
}

function validateLoginUser(obj) {
    const Schema = Joi.object({
        email: Joi.string().trim().required(),
        password: Joi.string().trim().min(8).required(),
    })

    return Schema.validate(obj);
}

function validateUpdateUser(obj) {
    const Schema = Joi.object({
        email: Joi.string().trim(),
        username: Joi.string().trim().min(2).max(20).required(),
        password: Joi.string().trim().min(8),        
    })

    return Schema.validate(obj);
}

module.exports = {
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser
};