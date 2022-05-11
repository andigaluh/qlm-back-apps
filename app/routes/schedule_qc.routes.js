const { authJwt } = require("../middleware");
const schedule_qc = require("../controllers/schedule_qc.controller.js");
const uploadFile = require("../middleware/uploadFile");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/download", schedule_qc.download);

  router.get("/download_template", schedule_qc.download_template);

  router.post(
    "/",
    [authJwt.verifyToken, uploadFile.single("file")],
    schedule_qc.create
  );

  // read all schedule_qc
  router.get("/", [authJwt.verifyToken], schedule_qc.findAll);

  router.get("/:id", [authJwt.verifyToken], schedule_qc.findOne);

  // delete schedule_qc by id
  router.delete("/:id", [authJwt.verifyToken], schedule_qc.deleteById);

  // Update a Job_class with id
  router.put(
    "/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    schedule_qc.update
  );

  app.use("/api/schedule_qc", router);
};
