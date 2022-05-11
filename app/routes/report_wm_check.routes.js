const { authJwt } = require("../middleware");
const report_wm_check = require("../controllers/report_wm_check.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  //router.get("/summary", report_wm_check.cronjobSummary);

  router.get("/dashboardOqc", report_wm_check.dashboardOqc);
  
  router.get("/dashboardHoldOqc", report_wm_check.dashboardHoldOqc);

  router.get("/download", report_wm_check.download);

  // Retrieve all Machines
  router.get("/", [authJwt.verifyToken], report_wm_check.findAll);

  // Retrieve a single Machine with id
  router.get("/:id", [authJwt.verifyToken], report_wm_check.findOne);


  // Retrieve all Machines

  app.use("/api/report-wm-check", router);
};
