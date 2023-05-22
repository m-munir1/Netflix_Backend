const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    password: req.body.password,
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      !user && res.status(401).json("Wrong email or password");
    } else {
      if (user.password !== req.body.password) {
        res.status(401).json("Wrong email or password");
      } else {
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "5d",
        });
        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  if (email != "admin@gmail.com") return res.send("sorry");
  if (password != "adminadmin") return res.send("sorry");
  res.send("01234cdeefgvr4532");
});
module.exports = router;
