const express = require("express");
const companyControl = require("../controler/company");
const { isLogin } = require("../middleware/verification");
const router = express.Router();
const { upload } = require("../helper/filehandler");

router
  .get("/profile", isLogin, companyControl.getProfile)
  .put("/profile", isLogin, upload.single("profileimage"), companyControl.editProfile)
  .delete("/deleteprofile", isLogin, companyControl.deleteProfile)
  .get("/profile/:id", isLogin, companyControl.getProfileByParams);

module.exports = router;
