const { authJwt } = require("../middleware");
const iqc_history = require("../controllers/iqc_history.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  router.get("/iqc/:id", [authJwt.verifyToken], iqc_history.findByIqcId);

  app.use("/api/iqc_history", router);
};
