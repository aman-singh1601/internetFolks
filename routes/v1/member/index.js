const express = require("express");
const { addMember, removeMember } = require("../../../controllers/v1/member/memberController");
const { isAuthenticated } = require("../../../controllers/v1/middlewares");


const router = express.Router();

router.post("/",isAuthenticated, addMember);
router.delete("/:id",isAuthenticated, removeMember);

module.exports = router;