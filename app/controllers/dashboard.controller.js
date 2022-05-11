const db = require("../models");
const Machine = db.machine;
const Machine_parts = db.machine_parts;
const Report_machine_check = db.report_machine_check;
const Machine_check_condition = db.machine_check_condition;
const Machine_check_problem = db.machine_check_problem;
const Machine_check_need_parts = db.machine_check_need_parts;
const Tools = db.tools;
const Parts = db.parts;
const Problem_machine = db.problem_machine;
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const fn = db.Sequelize.fn;
const literal = db.Sequelize.literal;
const col = db.Sequelize.col;
const Where = db.Sequelize.where;

exports.statusMachine = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineNG = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: [
      {
        jumlah_parts_ng: {
          [Op.gt]: 0,
        },
      },
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
    limit: 2,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    }); 
};

exports.statusMachineOK = (req, res) => {
  Report_machine_check.findAll({
    attributes: [
      [fn("COUNT", col("machine_check_id")), "total_check"],
      [
        literal('( SELECT IF (jumlah_parts_ng > 0, "ng", "ok" ) )'),
        "status_machine",
      ],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: [
      {
        jumlah_parts_ng: {
          [Op.eq]: 0,
        },
      },
    ],
    group: [
      "status_machine",
      fn("YEAR", col("inspection_date")),
      fn("MONTH", col("inspection_date")),
    ],
    order: [
      [fn("MONTH", col("inspection_date")), "DESC"],
      [fn("YEAR", col("inspection_date"))],
    ],
    limit: 2,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
      //res.send(resultData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineByMonthYear = async (req, res) => {
    now = new Date;
  Report_machine_check.findAll({
    attributes: [
      ["machine_check_id", "machine_check_id"],
      ["machine_code", "machine_code"],
      ["machine_name", "machine_name"],
      ["jumlah_parts_ok", "jumlah_parts_ok"],
      ["jumlah_parts_ng", "jumlah_parts_ng"],
      ["jumlah_problems", "jumlah_problems"],
      ["jumlah_need_parts", "jumlah_need_parts"],
      [fn("MONTHNAME", col("inspection_date")), "month"],
      [fn("YEAR", col("inspection_date")), "year"],
    ],
    where: {
      [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), fn("month", now)),
        Where(fn("YEAR", col("inspection_date")), fn("year", now)),
      ],
      /* [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), 11),
        Where(fn("YEAR", col("inspection_date")), 2021),
      ],  */
    },
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.statusMachineByNG = async (req, res) => {
  now = new Date();
  Report_machine_check.findAll({
    where: {
      [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), fn("month", now)),
        Where(fn("YEAR", col("inspection_date")), fn("year", now)),
        {
            jumlah_parts_ng : {
                [Op.gt] : 0
            }
        }
      ],
      /* [Op.and]: [
        Where(fn("MONTH", col("inspection_date")), 11),
        Where(fn("YEAR", col("inspection_date")), 2021),
      ], */
    },
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};


exports.alertParts = async (req, res) => {
  now = new Date();
  Parts.findAll({
    where: {
      qty: {
        [Op.lt]: 5,
      },
    },
    limit: 6,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.alertTools = async (req, res) => {
  now = new Date();
  Tools.findAll({
    where: {
      qty: {
        [Op.lt]: 5,
      },
    },
    limit: 6,
  })
    .then((data) => {
      //console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving machine.",
      });
    });
};

exports.totalProblemMachine = (req, res) => {
  Machine.findAll({
    attributes: {
      include: [
        [
          literal(`(
                    SELECT COUNT(*)
                    FROM problem_machines AS problem_machines
                    WHERE problem_machines.machine_id = machine.id
                )`),
          "countProblem",
        ],
      ],
    },
  }).then((data) => {
    res.send(data);
  });

}


