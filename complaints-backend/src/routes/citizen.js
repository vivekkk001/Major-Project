const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile
} = require("../controllers/citizen");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyToken, getProfile);

module.exports = router;
