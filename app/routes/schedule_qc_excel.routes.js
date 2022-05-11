const { authJwt } = require("../middleware");
const schedule_qc_excel = require("../controllers/schedule_qc_excel.controller.js");
const uploadExcel = require("../middleware/uploadExcel");

module.exports = (app) => {
  var router = require("express").Router();

  router.post(
    "/",
    [authJwt.verifyToken, uploadExcel.single("file")],
    schedule_qc_excel.uploadFiles
  );

  // read all schedule_qc_excel
  router.get("/", [authJwt.verifyToken], schedule_qc_excel.findAll);

  router.get("/:id", [authJwt.verifyToken], schedule_qc_excel.findOne);

  // delete schedule_qc_excel by id
  router.delete("/:id", [authJwt.verifyToken], schedule_qc_excel.deleteById);

  app.use("/api/schedule_qc_excel", router);
};
