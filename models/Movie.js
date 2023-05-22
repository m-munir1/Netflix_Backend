const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    publisher: {
      type: String,
    },
    producer: {
      type: String,
    },
    genre: {
      type: String,
    },
    age: {
      type: String,
    },
    movie: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    cover: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
