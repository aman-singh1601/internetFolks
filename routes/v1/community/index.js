const express = require("express");
const { createCommunity, getCommunity, getMembers } = require("../../../controllers/v1/community/communityController");
const { isAuthenticated } = require("../../../controllers/v1/middlewares");

const meRouter = require("./me");

const router = express.Router();

router.post("/", isAuthenticated, createCommunity);
router.get("/", getCommunity);
router.get("/:id/members", isAuthenticated, getMembers);
router.use("/me", isAuthenticated, meRouter);

module.exports = router;