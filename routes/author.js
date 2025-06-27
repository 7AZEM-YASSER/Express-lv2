const express = require("express");
const { Author } = require("../models/Author");
const { verifyToknAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allAuthors = await Author.find();
    res.json(allAuthors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching authors." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching author." });
  }
});

router.post("/", verifyToknAndAdmin, async (req, res) => {
  if (!req.body.firstName || req.body.firstName.length < 3) {
    return res
      .status(400)
      .json("First Name is required and must be at least 3 characters.");
  }
  if (!req.body.lastName || req.body.lastName.length < 3) {
    return res
      .status(400)
      .json("Last Name is required and must be at least 3 characters.");
  }
  if (!req.body.age || req.body.age < 16) {
    return res.status(400).json("Age must be at least 16.");
  }
  try {
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
    });

    const result = await author.save();

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No Data Sent" });
  }
});

router.put("/:id", verifyToknAndAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          age: req.body.age,
        },
      },
      { new: true }
    );

    res.status(200).json(author);
  } catch (error) {
    res.status(404).json({ message: "Author Not Found" });
    console.log(error);
  }
});

router.delete("/:id", verifyToknAndAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (author) {
      res.status(200).json({ message: "Author has been deleted" });
    }
  } catch (error) {
    res.status(404).json({ message: "Author Not Found" });
  }
});

module.exports = router;
