const express = require("express");
const workerControl = require("../controler/worker");
const { upload } = require("../helper/filehandler");
const { isLogin, isImage } = require("../middleware/verification");

const router = express.Router();

router
  .get("/profile", isLogin, workerControl.getProfile)
  .get("/profile/:id", workerControl.detailProfile)
  .put("/profile", isLogin, upload.single("avatar"), workerControl.editProfile)
  .post("/skill", isLogin, workerControl.addSkill)
  .post("/workexp", isLogin, upload.none(), workerControl.addWorkExp)
  .post("/portofolio", isLogin, upload.single("image"), workerControl.addPortofolio)
  .get("/wroker", workerControl.getAllProfile)
  .get("/hire", isLogin, workerControl.getHire)
  .put("/hire", isLogin, workerControl.editHire);

module.exports = router;
