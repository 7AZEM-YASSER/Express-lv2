// Librairy
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Middlewarss
const { logger } = require("./middlewares/logger");
const {notFound, errorHandle} = require("./middlewares/errors");

// First Config
const app = express();
app.use(express.json());

app.use(logger);

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/author", require("./routes/author"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Not Found Error
app.use(notFound);

// Error Handle
app.use(errorHandle);

app.get("/", (req, res) => {
  res.send("<h1 style='text-align: center; margin: 100px'>Hello world<h1/>");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server Is Running On Port 5000");
      console.log("Conection Is Successfully!");
      console.log("http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log("Disabled Conection", error);
  });