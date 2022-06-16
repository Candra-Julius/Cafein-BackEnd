const express = require("express");
const companyControl = require("../controler/company");
const { isLogin } = require("../middleware/verification");
const router = express.Router();
const { upload } = require("../helper/filehandler");

router
  .get("/profile", isLogin, companyControl.getProfile)
  .put("/profile", isLogin, upload.none(), companyControl.editProfile)
  .post("/test", upload.single("image"), companyControl.test)
  .post("/profileimage", isLogin, upload.single("image"), companyControl.profileImage)
  .delete("/deleteprofile", isLogin, companyControl.deleteProfile);

module.exports = router;
