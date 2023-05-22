const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
var bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
mongoose.set("strictQuery", false);
dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful..."))
  .catch((err) => console.log(err));
app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/movies", movieRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);

app.use("/lists", listRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
