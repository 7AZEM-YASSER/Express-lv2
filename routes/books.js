const express = require("express");
const { Book } = require("../models/Book");
const { verifyToknAndAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allBooks = await Book.find().populate('author', ["_id", "firstName", "lastName"]);
    res.json(allBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching books." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching book." });
  }
});

router.post("/", verifyToknAndAdmin, async (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res
      .status(400)
      .json("Name is required and must be at least 3 characters.");
  }
  if (!req.body.author) {
    return res.status(400).json("Author is required.");
  }
  if (!req.body.price || req.body.price < 20) {
    return res.status(400).json("Price is required and must be at least 20.");
  }

  try {
    const book = new Book({
      name: req.body.name,
      author: req.body.author,
      cover: req.body.cover,
      price: req.body.price,
    });

    const result = await book.save();

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No Data Sent" });
  }
});

router.put("/:id", verifyToknAndAdmin, async (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res.status(400).json("something wrong");
  }
  if (!req.body.author) {
    return res.status(400).json("something wrong");
  }
  if (!req.body.price || req.body.price < 20) {
    return res.status(400).json("something wrong");
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          author: req.body.author,
          cover: req.body.cover,
          price: req.body.price,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(404).json({ message: "Book Not Found" });
    console.log(error);
  }
});

router.delete("/:id", verifyToknAndAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Book has been deleted" });
    }
  } catch (error) {
    res.status(404).json({ message: "Book Not Found" });
  }
});

module.exports = router;
