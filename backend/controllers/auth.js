const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getSignupController = (req, res, next) => {
  res.send("<h1>This is signup route</h1>");
};

exports.getLoginController = (req, res, next) => {
  res.send("<h1>This is login page</h1>");
};

exports.postSignupController = async (req, res, next) => {
  try {
    const { email, password, name, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists!", existedUser: 1 });
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPw,
      name,
      country,
    });

    const result = await newUser.save();
    console.log("User created successfully", result);
    return res.json({ message: "User created successfully", userId: result._id, existedUser: 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.postLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist", existingUser: 0});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    const token = jwt.sign({ id: user._id.toString() }, "somesupersecretsecret", {
      expiresIn: "5h",
    });

    return res.json({ userId: user._id, token, existingUser: 1 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
