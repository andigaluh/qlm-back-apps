const db = require("../models");
const Iqc_history = db.iqc_history;
const Iqc = db.iqc;
const Op = db.Sequelize.Op;


exports.findByIqcId = (req, res) => {
    const iqc_id = req.params.id;
    let condition = {};

    condition.iqc_id = { [Op.eq]: iqc_id };

  Iqc_history.findAll({
    where: condition,
    include: [
      {
        model: Iqc,
        as: "iqc",
        attributes: ["id"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving job_class.",
      });
    });
};

/* // Retrieve all Job from the database.
exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.iqc_date = { [Op.gte]: start_date };
    condition.iqc_date = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.iqc_date = { [Op.gte]: start_date };
  }

  Iqc_history.findAll({
    where: condition,
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name"],
        include: [
          {
            model: Supplier,
            as: "supplier",
            attributes: ["id", "supplier_name"],
          },
        ],
      },
      {
        model: Defect,
        as: "defect",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "supervisor",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving job_class.",
      });
    });
};

// Find a single Job with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Iqc_history.findByPk(id, {
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name"],
      },
      {
        model: Defect,
        as: "defect",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find IQC with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving IQC with id=" + id,
      });
    });
}; */

