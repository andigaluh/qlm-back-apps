const { tools_type } = require("../models");
const db = require("../models");
const Tools = db.tools;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

exports.download = (req, res) => {
  Tools.findAll({
    include: [
      {
        model: tools_type,
        as: "tools_type",
        attributes: ["id", "name"],
      },
    ],
  }).then(async (data) => {
    let tools_data = [];
    let no = 1;
    data.forEach((obj) => {
      tools_data.push({
        no: no++,
        id: obj.id,
        tools_type_name: obj.tools_type.name,
        name: obj.name,
        expired_date: obj.expired_date,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tools PAQ");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Id", key: "id", width: 10 },
      { header: "Type", key: "tools_type_name", width: 10 },
      { header: "Name", key: "name", width: 10 },
      { header: "Expired Date", key: "expired_date", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tools_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_tools_pqa.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Tools
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Tools
  const tools = {
    name: req.body.name,
    qty: req.body.qty,
    tools_type_id: req.body.tools_type_id
  };

  // Save Tools in the database
  Tools.create(tools)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create tools success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tools.",
      });
    });
};

// Retrieve all Tools from the database.
exports.findAll = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.expired_date = { [Op.gte]: start_date };
    condition.expired_date = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.expired_date = { [Op.gte]: start_date };
  }

  Tools.findAll({
    where: condition,
    include: [
      {
        model: tools_type,
        as: "tools_type",
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
        message: err.message || "Some error occurred while retrieving tools.",
      });
    });
};

// Find a single Tools with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tools.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: tools_type,
        as: "tools_type",
        attributes: ["id", "name"],
      }
    ]
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tools with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tools with id=" + id,
      });
    });
};

// Update a Tools by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tools.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tools was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tools with id=${id}. Maybe Tools was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tools with id=" + id,
      });
    });
};

// Delete a Tools with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tools.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tools was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tools with id=${id}. Maybe Tools was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tools with id=" + id,
      });
    });
};

// Delete all Tools from the database.
exports.deleteAll = (req, res) => {
  Tools.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Toolses were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all toolses.",
      });
    });
};

// Find all published Tools
exports.findAllPublished = (req, res) => {
  Tools.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving toolses.",
      });
    });
};
