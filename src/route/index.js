const express = require("express");
const router = express.Router();
const auth = require("./auth");
const worker = require("./worker.js");
const company = require("./company.js");
const hire = require("./hire.js");

router.use("/auth", auth).use("/users", worker).use("/company", company).use("/hire", hire);

module.exports = router;
