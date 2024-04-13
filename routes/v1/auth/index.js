const express = require("express");
const { authSignup, authSignin, getMe } = require("../../../controllers/v1/auth/authController");
const { isAuthenticated } = require("../../../controllers/v1/middlewares");

const router = express.Router();

router.post("/signup", authSignup);
router.post("/signin", authSignin);
router.get("/me", isAuthenticated, getMe);

module.exports = router;