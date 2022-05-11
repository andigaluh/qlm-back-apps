const { authJwt } = require("../middleware");
const supplier_excel = require("../controllers/supplier_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [authJwt.verifyToken, uploadExcel.single("file")],
    supplier_excel.uploadFiles
  );

  app.use("/api/supplier_excel", router);
};
