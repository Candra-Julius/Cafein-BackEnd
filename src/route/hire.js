const express = require("express");
const hireControl = require("../controler/hire");
const { isLogin } = require("../middleware/verification");
const router = express.Router();

router.get("/", isLogin, hireControl.getHire).post("/:id", isLogin, hireControl.insertHire).put("/", hireControl.editHire).delete("/delete", hireControl.deletehire);

module.exports = router;
