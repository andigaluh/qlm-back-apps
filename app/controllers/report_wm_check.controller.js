const db = require("../models");
const Machine = db.machine;
const Machine_parts = db.machine_parts;
const Report_wm_check = db.report_wm_check;
const Wm_check_item = db.wm_check_item;
const Wm_check_ng = db.wm_check_ng;
const Wm_check_improvement = db.wm_check_improvement;
const User = db.user;
const Notif = db.notif;
const Wm_item_check = db.wm_item_check;
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const literal = db.Sequelize.literal;
const fn = db.Sequelize.fn;

exports.download = (req, res) => {
  Report_wm_check.findAll().then(async (data) => {
    let report_machine_data = [];
    let no = 1;
    data.forEach((obj) => {
      report_machine_data.push({
        no: no++,
        wm_type_name: obj.wm_type_name,
        inspection_date: obj.inspection_date,
        inspection_approval: obj.inspection_approval,
        supervisor_date: obj.supervisor_date,
        supervisor_approval: obj.supervisor_approval,
        wm_model_name: obj.wm_model_name,
        inspection_name: obj.inspection_name,
        supervisor_name: obj.supervisor_name,
        supervisor_username: obj.supervisor_username,
        jumlah_item_ok: obj.jumlah_item_ok,
        jumlah_item_ng: obj.jumlah_item_ng,
        total_check_item: obj.total_check_item,
        jumlah_detail_ng: obj.jumlah_detail_ng,
        jumlah_improvement: obj.jumlah_improvement,
        createdAt: obj.createdAt,
        inspection_lot_qty: obj.inspection_lot_qty,
        inspection_qty: obj.inspection_qty,
        inspection_group: obj.inspection_group,
        inspection_line: obj.inspection_line,
        inspection_lot_ke: obj.inspection_lot_ke,
        inspection_status: obj.inspection_status,
        inspection_sn: obj.inspection_sn,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("report_machine");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Wm Type Name", key: "wm_type_name", width: 10 },
      { header: "Inspection Date", key: "inspection_date", width: 10 },
      { header: "Inspection Name", key: "inspection_name", width: 10 },
      { header: "Inspection Approval", key: "inspection_approval", width: 10 },
      { header: "Supervisor Date", key: "supervisor_date", width: 10 },
      { header: "Supervisor NIK", key: "supervisor_username", width: 10 },
      { header: "Supervisor Name", key: "supervisor_name", width: 10 },
      { header: "Supervisor Approval", key: "supervisor_approval", width: 10 },
      { header: "Model", key: "wm_model_name", width: 10 },
      { header: "Lot Qty", key: "inspection_lot_qty", width: 10 },
      { header: "Qty", key: "inspection_qty", width: 10 },
      { header: "Group", key: "inspection_group", width: 10 },
      { header: "Line", key: "inspection_line", width: 10 },
      { header: "Lot ke", key: "inspection_lot_ke", width: 10 },
      { header: "Status", key: "inspection_status", width: 10 },
      { header: "Serial number", key: "inspection_sn", width: 10 },
      { header: "Jumlah Item OK", key: "jumlah_item_ok", width: 10 },
      { header: "Jumlah Item NG", key: "jumlah_item_ng", width: 10 },
      { header: "Total Check Item", key: "total_check_item", width: 10 },
      { header: "Jumlah Detail NG", key: "jumlah_detail_ng", width: 10 },
      { header: "Jumlah Improvement", key: "jumlah_improvement", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(report_machine_data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + Date.now() + "_report_machine_check.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// Retrieve all Machine from the database.
exports.findAll = (req, res) => {
  const wm_type_name = req.query.title;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};

  if (wm_type_name) {
    condition.wm_type_name = { [Op.like]: `%${wm_type_name}%` };
  }

  if (start_date && end_date) {
    condition.inspection_date = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.inspection_date = { [Op.gte]: start_date };
  }

  Report_wm_check.findAll({
    where: condition,
    order: [["wm_check_id", "DESC"]],
  })
    .then((data) => {
      let arrayData = [];
      data.map((item) => {
        let status = "NG";
        status = item.jumlah_item_ng && item.jumlah_item_ng > 0 ? "NG" : "OK";
        arrayData.push({
          createdAt: item.createdAt,
          inspection_approval: item.inspection_approval,
          inspection_date: item.inspection_date,
          inspection_id: item.inspection_id,
          inspection_name: item.inspection_name,
          inspection_username: item.inspection_username,
          jumlah_improvement: item.jumlah_improvement,
          jumlah_item_ng: item.jumlah_item_ng,
          jumlah_item_ok: item.jumlah_item_ok,
          jumlah_detail_ng: item.jumlah_detail_ng,
          wm_check_id: item.wm_check_id,
          wm_type_id: item.wm_type_id,
          wm_type_name: item.wm_type_name,
          wm_model_id: item.wm_model_id,
          wm_model_name: item.wm_model_name,
          supervisor_approval: item.supervisor_approval,
          supervisor_date: item.supervisor_date,
          supervisor_id: item.supervisor_id,
          supervisor_name: item.supervisor_name,
          total_check_item: item.total_check_item,
          inspection_status: item.inspection_status,
          inspection_lot_qty: item.inspection_lot_qty,
          inspection_qty: item.inspection_qty,
          inspection_group: item.inspection_group,
          inspection_line: item.inspection_line,
          inspection_lot_ke: item.inspection_lot_ke,
          inspection_sn: item.inspection_sn,
          createdAt: item.createdAt,
        });
      });
      console.log(arrayData);
      res.send(arrayData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving washing machine.",
      });
    });
};

// Find a single Machine with an id
exports.findOne = async (req, res) => {
  const wm_check_id = req.params.id;
  var WmCheckItemArr = [];
  var wmCheckNgArr = [];
  var WmCheckImprovementArr = [];
  const ReportWmCheck = await Report_wm_check.findByPk(
    wm_check_id
  );

  if (ReportWmCheck) {
    const WmCheckItem = await Wm_check_item.findAll({
      where: {
        wm_check_id: wm_check_id,
      },
      include: [
        {
          model: Wm_item_check,
          as: "wm_item_check",
          attributes: ["name", "standard", "is_boolean","status"],
        },
      ],
    });

    if (WmCheckItem.length > 0) {
      WmCheckItem.map((valCondition) => {
        WmCheckItemArr.push({
          wm_item_check_id: valCondition.wm_item_check_id,
          wm_item_check_name: valCondition.wm_item_check.name,
          wm_item_check_standard: valCondition.wm_item_check.standard,
          wm_item_check_is_boolean: valCondition.wm_item_check.is_boolean,
          wm_item_check_result: valCondition.check_value,
          status: valCondition.status,
        });
      });
    }

    const WmCheckNg = await Wm_check_ng.findAll({
      where: {
        wm_check_id: wm_check_id,
      },
      attributes: ["sn", "masalah", "tindakan", "wm_item_check_id"],
      include: [
        {
          model: Wm_item_check,
          as: "wm_item_check",
          attributes: ["name", "standard", "is_boolean", "status"],
        },
      ],
    });

    if (WmCheckNg.length > 0) {
      WmCheckNg.map((valProblem) => {
        wmCheckNgArr.push({
          sn: valProblem.sn,
          masalah: valProblem.masalah,
          tindakan: valProblem.tindakan,
          wm_item_check_id: valProblem.wm_item_check_id,
          wm_item_check_name: valProblem.wm_item_check.name,
          wm_item_check_standard: valProblem.wm_item_check.standard,
        });
      });
    }

    const WmCheckImprovement = await Wm_check_improvement.findAll({
      where: {
        wm_check_id: wm_check_id,
      },
    });

    if (WmCheckImprovement.length > 0) {
      WmCheckImprovement.map((valNeedParts) => {
        WmCheckImprovementArr.push({
          wm_check_id: valNeedParts.wm_check_id,
          name: valNeedParts.name,
          standard: valNeedParts.standard,
          is_boolean: valNeedParts.is_boolean,
          status: valNeedParts.status,
          result: valNeedParts.result,
        });
      });
    }

    var data_resp = {
      wm_type_name: ReportWmCheck.wm_type_name,
      inspection_name: ReportWmCheck.inspection_name,
      wm_model_name: ReportWmCheck.wm_model_name,
      supervisor_id: ReportWmCheck.supervisor_id,
      supervisor_approval: ReportWmCheck.supervisor_approval,
      inspection_lot_qty: ReportWmCheck.inspection_lot_qty,
      inspection_qty: ReportWmCheck.inspection_qty,
      inspection_group: ReportWmCheck.inspection_group,
      inspection_line: ReportWmCheck.inspection_line,
      inspection_lot_ke: ReportWmCheck.inspection_lot_ke,
      inspection_status: ReportWmCheck.inspection_status,
      inspection_sn: ReportWmCheck.inspection_sn,
      inspection_date: ReportWmCheck.inspection_date,
      inspection_approval: ReportWmCheck.inspection_approval,
      supervisor_date: ReportWmCheck.supervisor_date,
      createdAt: ReportWmCheck.createdAt,
      photo_name: ReportWmCheck.photo_name,
      wm_type_id: ReportWmCheck.wm_type_id,
      wm_model_id: ReportWmCheck.wm_model_id,
      WmCheckItemArr: WmCheckItemArr,
      wmCheckNgArr: wmCheckNgArr,
      WmCheckImprovementArr: WmCheckImprovementArr,
    };

    res.status(200).send(data_resp);
  } else {
    res.status(500).send({
      messages: "Failed retrieve washing machine check",
    });
  }
};

exports.dashboardOqc = (req, res) => {
  Report_wm_check.findAll({
    order: [["wm_check_id", "DESC"]],
    offset: 0,
    limit: 1
  })
    .then((data) => {
      let arrayData = [];
      data.map((item) => {
        let status = "NG";
        status = item.jumlah_item_ng && item.jumlah_item_ng > 0 ? "NG" : "OK";
        arrayData.push({
          createdAt: item.createdAt,
          inspection_approval: item.inspection_approval,
          inspection_date: item.inspection_date,
          inspection_id: item.inspection_id,
          inspection_name: item.inspection_name,
          inspection_username: item.inspection_username,
          jumlah_improvement: item.jumlah_improvement,
          jumlah_item_ng: item.jumlah_item_ng,
          jumlah_item_ok: item.jumlah_item_ok,
          jumlah_detail_ng: item.jumlah_detail_ng,
          wm_check_id: item.wm_check_id,
          wm_type_id: item.wm_type_id,
          wm_type_name: item.wm_type_name,
          wm_model_id: item.wm_model_id,
          wm_model_name: item.wm_model_name,
          supervisor_approval: item.supervisor_approval,
          supervisor_date: item.supervisor_date,
          supervisor_id: item.supervisor_id,
          supervisor_name: item.supervisor_name,
          total_check_item: item.total_check_item,
          inspection_status: item.inspection_status,
          inspection_lot_qty: item.inspection_lot_qty,
          inspection_qty: item.inspection_qty,
          inspection_group: item.inspection_group,
          inspection_line: item.inspection_line,
          inspection_lot_ke: item.inspection_lot_ke,
          inspection_sn: item.inspection_sn,
          createdAt: item.createdAt,
          photo_name: item.photo_name
        });
      });
      //console.log(arrayData);
      res.send(arrayData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine.",
      });
    });
};

exports.dashboardHoldOqc = (req, res) => {
  let condition = {};

  condition.inspection_status = { [Op.eq]: "HOLD" };

  Report_wm_check.findAll({
    where: condition,
    order: [["wm_check_id", "DESC"]],
    offset: 0,
    limit: 1,
  })
    .then((data) => {
      let arrayData = [];
      data.map((item) => {
        let status = "NG";
        status = item.jumlah_item_ng && item.jumlah_item_ng > 0 ? "NG" : "OK";
        arrayData.push({
          createdAt: item.createdAt,
          inspection_approval: item.inspection_approval,
          inspection_date: item.inspection_date,
          inspection_id: item.inspection_id,
          inspection_name: item.inspection_name,
          inspection_username: item.inspection_username,
          jumlah_improvement: item.jumlah_improvement,
          jumlah_item_ng: item.jumlah_item_ng,
          jumlah_item_ok: item.jumlah_item_ok,
          jumlah_detail_ng: item.jumlah_detail_ng,
          wm_check_id: item.wm_check_id,
          wm_type_id: item.wm_type_id,
          wm_type_name: item.wm_type_name,
          wm_model_id: item.wm_model_id,
          wm_model_name: item.wm_model_name,
          supervisor_approval: item.supervisor_approval,
          supervisor_date: item.supervisor_date,
          supervisor_id: item.supervisor_id,
          supervisor_name: item.supervisor_name,
          total_check_item: item.total_check_item,
          inspection_status: item.inspection_status,
          inspection_lot_qty: item.inspection_lot_qty,
          inspection_qty: item.inspection_qty,
          inspection_group: item.inspection_group,
          inspection_line: item.inspection_line,
          inspection_lot_ke: item.inspection_lot_ke,
          inspection_sn: item.inspection_sn,
          createdAt: item.createdAt,
        });
      });
      //console.log(arrayData);
      res.send(arrayData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving washing machine.",
      });
    });
};


/* exports.cronjobSummary = async (req, res) => {
  const machine_name = req.query.title;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  let condition = {};
  let result = [];
  let resultReport = [];
  let statusReport = false;
  let today = new Date(),
    month = "" + (today.getMonth() + 1),
    day = "" + today.getDate(),
    year = today.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  let fullDate_today = [year, month, day].join("-");

  if (machine_name) {
    condition.machine_name = { [Op.like]: `%${machine_name}%` };
  }

  if (start_date && end_date) {
    condition.date = { [Op.gte]: start_date, [Op.lte]: end_date };
  } else if (start_date) {
    condition.date = { [Op.gte]: start_date };
  }

  const dbMachine = await Machine.findAll({
    attributes: [
      [fn("DATE", today), "date"],
      ["id", "id"],
      ["code", "code"],
      ["name", "name"],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 1 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_pagi",
      ],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 2 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_sore",
      ],
      [
        literal(
          "IF((select shift_id from report_machine_checks where report_machine_checks.machine_id = id and report_machine_checks.shift_id = 3 and DATE(date) = now()) >0, TRUE, FALSE)"
        ),
        "shift_malam",
      ],
    ],
  });

  const receiverNotif = await User.findAll({
    where: {
      job_id: {
        [Op.gte]: 4,
      },
    },
    attributes: [
      ["id", "id"],
      ["username", "username"],
      ["name", "name"],
      ["email", "email"],
    ],
  });

  //let userReceiverNotifId = receiverNotif.id;

  let messagesNotif = "";

  messagesNotif = `Berikut rangkuman daily check hari ini tanggal ${fullDate_today} : \n ${JSON.stringify(
    dbMachine,
    0,
    2
  )}`;

  if (receiverNotif) {
    receiverNotif.map(async (user) => {
      await Notif.create({
        user_id: user.id,
        title: `Rangkuman daily check machine tanggal ${fullDate_today}`,
        messages: messagesNotif,
        is_read: false,
      });
    });
  }

  res.send({
    error: false,
    messages: "summary notification success",
  });

}; */
