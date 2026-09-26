const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName?.firstName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const { firstName, lastName } = fullName;

    const isUserAlreadyExists = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName: {
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
      },
      email: email.toLowerCase().trim(),
      password: hashPassword,
    });

    const chatNovaToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("chatNovaToken", chatNovaToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        email: user.email,
        _id: user._id,
        fullName: user.fullName,
      },
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const chatNovaToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("chatNovaToken", chatNovaToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "User Logged in Successfully",
      user: {
        email: user.email,
        _id: user._id,
        fullName: user.fullName,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getCurrentUser(req, res) {
  try {
    return res.status(200).json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("chatNovaToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};