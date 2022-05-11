const { authJwt } = require("../middleware");
const iqc = require("../controllers/iqc.controller.js");
const uploadFile = require("../middleware/uploadFile");

module.exports = (app) => {
  var router = require("express").Router();

  // read all iqc
  router.get("/dashboardIqc", iqc.dashboardIqc);
  router.get("/dashboardHold", iqc.dashboardHold);

  router.get("/hold", [authJwt.verifyToken], iqc.findAllHold);

  router.get("/download", iqc.download);

  router.post(
    "/",
    [authJwt.verifyToken, uploadFile.single("file")],
    iqc.create
  );

  // read all iqc
  router.get("/", [authJwt.verifyToken], iqc.findAll);

  router.get("/:id", [authJwt.verifyToken], iqc.findOne);

  // delete iqc by id
  router.delete("/:id", [authJwt.verifyToken], iqc.delete);

  // Update a Job_class with id
  router.put(
    "/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    iqc.update
  );

  router.put(
    "/hold/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    iqc.updateHold
  );

  app.use("/api/iqc", router);
};
