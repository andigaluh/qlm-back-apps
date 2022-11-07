const { authJwt } = require("../middleware");
const daily_report = require("../controllers/daily_report.controller.js");
const uploadFile = require("../middleware/uploadFile");

module.exports = (app) => {
  var router = require("express").Router();

  /* router.post(
    "/",
    [authJwt.verifyToken, uploadFile.single("file")],
    daily_report.uploadFiles
  ); */

  router.post(
    "/",
    [authJwt.verifyToken],
    daily_report.create
  );

  // read all daily_report
  router.get("/", [authJwt.verifyToken], daily_report.findAll);

  router.get("/public", daily_report.findAll);

  router.get("/:id", [authJwt.verifyToken], daily_report.findOne);

  // delete daily_report by id
  router.delete("/:id", [authJwt.verifyToken], daily_report.deleteById);

  // Update a Job_class with id
  /* router.put(
    "/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    daily_report.update
  ); */

  router.put(
    "/:id",
    [authJwt.verifyToken],
    daily_report.update
  );

  router.put(
    "/draft/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    daily_report.updateDraft
  );

  router.put(
    "/release/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    daily_report.updateRelease
  );

  app.use("/api/daily_report", router);
};
