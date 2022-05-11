const db = require("../models");
const Parts = db.parts;
const Supplier = db.supplier;
const Op = db.Sequelize.Op;
const excel = require("exceljs");

// Create and Save a new Parts
exports.create = (req, res) => {
  // Validate request
  if (!req.body.parts_code) {
    res.status(400).send({
      message: "Parts code can not be empty!",
    });
    return;
  }

  // Create a Parts
  const parts = {
    parts_code: req.body.parts_code,
    parts_name: req.body.parts_name,
    status: req.body.status ? req.body.status : false,
    supplier_id: req.body.supplier_id,
    standard: req.body.standard,
  };

  // Save Parts in the database
  Parts.create(parts)
    .then((data) => {
      res.send({
        message: "Create parts success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Parts.",
      });
    });
};

// Retrieve all Parts from the database.
exports.findAll = (req, res) => {
  const parts_code = req.query.parts_code;
  const parts_name = req.query.parts_name;
  let condition = {};

  if (parts_code) {
    condition.parts_code = { [Op.like]: `%${parts_code}%` };
  }

  if (parts_name) {
    condition.parts_name = { [Op.like]: `%${parts_name}%` };
  }

  Parts.findAll({
    where: condition,
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_name"],
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
          err.message || "Some error occurred while retrieving parts.",
      });
    });
};

// Find a single Parts with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Parts.findByPk(id, {
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_name"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Parts with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Parts with id=" + id + " error= " + err,
      });
    });
};

// Update a Parts by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Parts.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update parts success.",
        });
      } else {
        res.send({
          message: `Cannot update Parts with id=${id}. Maybe Parts was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Parts with id=" + id,
      });
    });
};

// Delete a Parts with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Parts.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete parts success",
        });
      } else {
        res.send({
          message: `Cannot delete Parts with id=${id}. Maybe Parts was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Parts with id=" + id,
      });
    });
};

// Delete all Parts from the database.
exports.deleteAll = (req, res) => {
  Parts.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Parts Success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all parts.",
      });
    });
};

// Find all published Parts
exports.findAllPublished = (req, res) => {
  Parts.findAll({
    where: { status: true },
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_name"],
      },
    ],
    order: [["parts_name", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving parts.",
      });
    });
};

exports.download_template = (req, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Parts");

  worksheet.columns = [
    { header: "Parts code", key: "parts_code", width: 10 },
    { header: "Parts name", key: "parts_name", width: 10 },
    { header: "Standard", key: "standard", width: 10 },
    { header: "supplier id", key: "supplier_id", width: 10 },
  ];

  Supplier.findAll().then(async (data) => {
    let supplier_data = [];
    data.forEach((obj) => {
      supplier_data.push({
        id: obj.id,
        supplier_code: obj.supplier_code,
        supplier_name: obj.supplier_name,
      });
    });
    let worksheet_supplier = workbook.addWorksheet("Supplier");

    worksheet_supplier.columns = [
      { header: "Supplier id", key: "id", width: 10 },
      { header: "Supplier code", key: "supplier_code", width: 10 },
      { header: "Supplier name", key: "supplier_name", width: 10 },
    ];

    // Add Array Rows
    worksheet_supplier.addRows(supplier_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_parts_template.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

exports.findBySupplier = (req, res) => {
  const supplier_id = req.params.id;
  Parts.findAll({
    where: { supplier_id: supplier_id },
    include: [
      {
        model: Supplier,
        as: "supplier",
        attributes: ["id", "supplier_code" ,"supplier_name"],
      },
    ],
    order: [["parts_name", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parts.",
      });
    });
};
