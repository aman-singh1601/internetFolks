const express = require("express");
const { createRole, getAllRoles } = require("../../../controllers/v1/role/roleController");



const router = express.Router();

router.post("/", createRole);
router.get("/", getAllRoles);

module.exports = router;