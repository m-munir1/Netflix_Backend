const express = require("express");
const Movie = require("../models/Movie");
const verify = require("../verifyToken");
const multer = require("multer");
var MulterAzureStorage = require("multer-azure-storage");
var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString:
      "DefaultEndpointsProtocol=https;AccountName=entertainmentwebstorage;AccountKey=gBhMXqTChF3qQiP+Izlq7DVASyelZFFCL52/mNT9gP9HI8A2YIBBcF6rmdttjmimvQMscq20uDmG+AStSwcL2w==;EndpointSuffix=core.windows.net",
    containerName: "entertainmentweb",
    containerSecurity: "blob",
  }),
});
const router = express.Router();
// Create
router.post(
  "/",
  upload.fields([
    { name: "movies", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    const movieobject = {
      title: req.body.title,
      publisher: req.body.publisher,
      producer: req.body.producer,
      genre: req.body.genre,
      age: req.body.age,
      description: req.body.description,
      movie: req.files.movies[0].url,
      thumbnail: req.files.thumbnail[0].url,
      cover: req.files.cover[0].url,
    };
    const newMovie = new Movie(movieobject);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Update
router.put("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Not authorized to update movies");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  // if (req.user.isAdmin) {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json("Movie deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
  // } else {
  //   res.status(403).json("Not authorized to delete movies");
  // }
});

// Get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get random
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all
router.get("/", async (req, res) => {
  const query = req.query.new;

  // if (req.user.isAdmin) {
  try {
    const movies = query
      ? await Movie.find().sort({ _id: -1 }).limit(5)
      : await Movie.find();
    res.status(200).json(movies.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
  // } else {
  //   res.status(403).json("Not authorized to view all movies");
  // }
});

module.exports = router;
