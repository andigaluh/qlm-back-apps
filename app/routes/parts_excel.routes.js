const { authJwt } = require("../middleware");
const parts_excel = require("../controllers/parts_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [authJwt.verifyToken, uploadExcel.single("file")],
    parts_excel.uploadFiles
  );

  app.use("/api/parts_excel", router);
};
