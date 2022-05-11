const db = require("../models");
const Iqc = db.iqc;
const Parts = db.parts;
const User = db.user;
const Defect = db.defect;
const Supplier = db.supplier;
const Org = db.org;
const Notif = db.notif;
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const Iqc_history = db.iqc_history;

exports.download = (req, res) => {
  Iqc.findAll({
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name", "standard"],
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
  }).then(async (data) => {
    let iqc_data = [];
    let no = 1;
    data.forEach((obj) => {
      iqc_data.push({
        no: no++,
        iqc_date: obj.iqc_date,
        parts_code: obj.parts.parts_code,
        parts_name: obj.parts.parts_name,
        supplier_name: obj.parts.supplier.supplier_name,
        standard: obj.parts.supplier.standard,
        actual: obj.actual,
        incoming_qty: obj.incoming_qty,
        sampling_qty: obj.sampling_qty,
        ng_qty: obj.ng_qty,
        status: obj.status,
        sorting_lot: obj.sorting_lot,
        sorting_ok: obj.sorting_ok,
        sorting_ng: obj.sorting_ng,
        detail_problem: obj.detail_problem,
        action: obj.action,
        action_qty: obj.action_qty,
        defect: obj.defect ? obj.defect.name : null,
        user: obj.user.name,
        supervisor: obj.supervisor ? obj.supervisor.name : null,
        createdAt: obj.createdAt,
      });
    });

    //console.log(iqc_data);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("report_machine");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Date", key: "iqc_date", width: 10 },
      { header: "Parts code", key: "parts_code", width: 10 },
      { header: "Parts name", key: "parts_name", width: 10 },
      { header: "Supplier name", key: "supplier_name", width: 10 },
      { header: "Standard", key: "standard", width: 10 },
      { header: "Actual", key: "actual", width: 10 },
      { header: "Incoming Qty", key: "incoming_qty", width: 10 },
      { header: "Sampling Qty", key: "sampling_qty", width: 10 },
      { header: "NG Qty", key: "ng_qty", width: 10 },
      { header: "Status", key: "status", width: 10 },
      { header: "Sorting Lot", key: "sorting_lot", width: 10 },
      { header: "Sorting OK", key: "sorting_ok", width: 10 },
      { header: "Sorting NG", key: "sorting_ng", width: 10 },
      { header: "Detail problem", key: "detail_problem", width: 10 },
      { header: "Action", key: "action", width: 10 },
      { header: "Action Qty", key: "action_key", width: 10 },
      { header: "Defect", key: "defect", width: 10 },
      { header: "Inspector", key: "user", width: 10 },
      { header: "Supervisor", key: "supervisor", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(iqc_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_iqc.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Create and Save a new Job
exports.create = (req, res) => {
  // Validate request
  if (!req.body.iqc_date) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  // Create a Job
  const iqc = {
    iqc_date: req.body.iqc_date,
    incoming_qty: req.body.incoming_qty,
    sampling_qty: req.body.sampling_qty,
    ng_qty: req.body.ng_qty,
    status: req.body.status,
    parts_id: req.body.parts_id,
    user_id: req.body.user_id,
    supervisor_id: req.body.supervisor_id,
    actual: req.body.actual,
  };

  // Save Job in the database
  Iqc.create(iqc)
    .then(async (data) => {
      const iqc_id = data.id;

      await Iqc_history.create({
        iqc_id: iqc_id,
        status: req.body.status,
        description: "create incoming item",
      });
      
      if (req.body.supervisor_id > 0) {
        await Notif.create({
          user_id: req.body.supervisor_id,
          title: `Incoming Hold List Notification - ${req.body.iqc_date}`,
          messages: `Hai, terdapat incoming hold item saat ini. silakan direview dan approve.`,
          is_read: false,
        });
      }

      res.send({
        message: "Create incoming qc success",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Job.",
      });
    });
};

// Retrieve all Job from the database.
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

  Iqc.findAll({
    where: condition,
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name", "standard"],
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

  Iqc.findByPk(id, {
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name", "standard"],
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
};

// Update a Job by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  let data = {};
  let dateNow = new Date();
  //console.log(req.file);
  //console.log(req.body.filename);
  if (req.body.photo_name) {
    data = {
      iqc_date: req.body.iqc_date,
      incoming_qty: req.body.incoming_qty,
      sampling_qty: req.body.sampling_qty,
      ng_qty: req.body.ng_qty,
      status: req.body.status,
      sorting_lot: req.body.sorting_lot,
      sorting_ok: req.body.sorting_ok,
      sorting_ng: req.body.sorting_ng,
      detail_problem: req.body.detail_problem,
      action: req.body.action,
      action_qty: req.body.action_qty,
      image_sheet: req.body.image_sheet,
      photo_name: req.body.photo_name,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      supervisor_id: req.body.supervisor_id,
      actual: req.body.actual,
    };
  } else {
    data = {
      iqc_date: req.body.iqc_date,
      incoming_qty: req.body.incoming_qty,
      sampling_qty: req.body.sampling_qty,
      ng_qty: req.body.ng_qty,
      status: req.body.status,
      sorting_lot: req.body.sorting_lot,
      sorting_ok: req.body.sorting_ok,
      sorting_ng: req.body.sorting_ng,
      detail_problem: req.body.detail_problem,
      action: req.body.action,
      action_qty: req.body.action_qty,
      image_sheet: req.body.image_sheet,
      parts_id: req.body.parts_id,
      user_id: req.body.user_id,
      supervisor_id: req.body.supervisor_id,
      actual: req.body.actual,
    };
  }
  
  Iqc.update(data, {
    where: { id: id },
  })
    .then( async (num) => {
      if (num == 1) {

        await Iqc_history.create({
          iqc_id: id,
          status: req.body.status,
          description: "update incoming item",
        });

        res.send({
          message: "Update Incoming QC success.",
        });
      } else {
        res.send({
          message: `Cannot update Incoming QC with id=${id}. Maybe Incoming QC was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Incoming QC with id=" + id,
      });
    });
};

// Delete a Job with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Iqc.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete Incoming QC success",
        });
      } else {
        res.send({
          message: `Cannot delete Incoming QC with id=${id}. Maybe Incoming QC was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Incoming QC with id=" + id,
      });
    });
};

// Delete all Job from the database.
exports.deleteAll = (req, res) => {
  Iqc.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `Delete ${nums} Incoming QC success` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Incoming QC.",
      });
    });
};

exports.findAllHold = (req, res) => {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (start_date && end_date) {
    condition.iqc_date = { [Op.gte]: start_date };
    condition.iqc_date = { [Op.lte]: end_date };
  } else if (start_date) {
    condition.iqc_date = { [Op.gte]: start_date };
  }

  condition.status = { [Op.eq]: "HOLD" };

  Iqc.findAll({
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
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      //console.log(data)
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Hold List Incoming.",
      });
    });
};

// Update a Job by the id in the request
exports.updateHold = (req, res) => {
  const id = req.params.id;
  let iqc = {};
  if (req.file) {
    iqc = {
      sorting_lot: req.body.sorting_lot,
      sorting_ok: req.body.sorting_ok,
      sorting_ng: req.body.sorting_ng,
      detail_problem: req.body.detail_problem,
      action: req.body.action,
      action_qty: req.body.action_qty,
      remark_return: req.body.remark_return,
      image_sheet: req.file.filename,
      defect_id: req.body.defect_id,
      status: req.body.status,
      photo_name: req.body.photo_name,
      actual: req.body.actual
    };
  } else {
    iqc = {
      sorting_lot: req.body.sorting_lot,
      sorting_ok: req.body.sorting_ok,
      sorting_ng: req.body.sorting_ng,
      detail_problem: req.body.detail_problem,
      action: req.body.action,
      action_qty: req.body.action_qty,
      remark_return: req.body.remark_return,
      defect_id: req.body.defect_id,
      status: req.body.status,
      photo_name: req.body.photo_name,
      actual: req.body.actual,
    };
  } 
  
  Iqc.update(iqc, {
    where: { id: id },
  })
    .then( async (num) => {
      if (num == 1) {

        await Iqc_history.create({
          iqc_id: id,
          status: req.body.status,
          description: "update status incoming item",
        });

        res.send({
          message: "Update Incoming QC success.",
        });
      } else {
        res.send({
          message: `Cannot update Incoming QC with id=${id}. Maybe Incoming QC was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Incoming QC with id=" + id,
      });
    });
};

exports.dashboardIqc = (req, res) => {
  Iqc.findAll({
    include: [
      {
        model: Parts,
        as: "parts",
        attributes: ["id", "parts_code", "parts_name", "standard"],
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
    offset: 0,
    limit: 1,
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

exports.dashboardHold = (req, res) => {
  let condition = {};
  condition.status = { [Op.eq]: "HOLD" };

  Iqc.findAll({
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
    ],
    order: [["id", "DESC"]],
    offset: 0,
    limit: 1
  })
    .then((data) => {
      //console.log(data)
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Hold List Incoming.",
      });
    });
};
