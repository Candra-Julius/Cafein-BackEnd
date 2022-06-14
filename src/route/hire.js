const express = require("express");
const hireControl = require("../controler/hire");
const { isLogin } = require("../middleware/verification");
const router = express.Router();

router.get("/hire", isLogin, hireControl.getHire).post("/hire", isLogin, hireControl.insertHire);

module.exports = router;
