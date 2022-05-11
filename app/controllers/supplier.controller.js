const db = require("../models");
const Supplier = db.supplier;
const Op = db.Sequelize.Op;

// Create and Save a new Supplier
exports.create = (req, res) => {
  // Validate request
  if (!req.body.supplier_name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // Create a Supplier
  const supplier = {
    supplier_code: req.body.supplier_code,
    supplier_name: req.body.supplier_name,
    status: req.body.status ? req.body.status : false,
  };

  // Save Supplier in the database
  Supplier.create(supplier)
    .then((data) => {
      res.send({
        message: "Create supplier success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Supplier.",
      });
    });
};

// Retrieve all Supplier from the database.
exports.findAll = (req, res) => {
  const supplier_code = req.query.supplier_code;
  const supplier_name = req.query.supplier_name;
  let condition = {};

  if (supplier_code) {
    condition.supplier_code = { [Op.like]: `%${supplier_code}%` };
  }

  if (supplier_name) {
    condition.supplier_name = { [Op.like]: `%${supplier_name}%` };
  }

  Supplier.findAll({
    where: condition,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving supplier.",
      });
    });
};

// Find a single Supplier with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Supplier.findByPk(id, {
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Supplier with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Supplier with id=" + id,
      });
    });
};

// Update a Supplier by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Supplier.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update supplier success",
        });
      } else {
        res.send({
          message: `Cannot update Supplier with id=${id}. Maybe Supplier was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Supplier with id=" + id,
      });
    });
};

// Delete a Supplier with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Supplier.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete supplier success",
        });
      } else {
        res.send({
          message: `Cannot delete Supplier with id=${id}. Maybe Supplier was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Supplier with id=" + id,
      });
    });
};

// Delete all Supplier from the database.
exports.deleteAll = (req, res) => {
  Supplier.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} suppliers success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all suppliers.",
      });
    });
};

// Find all published Supplier
exports.findAllPublished = (req, res) => {
  Org_class.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving org_classes.",
      });
    });
};
