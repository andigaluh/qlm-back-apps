const { sequelize, wm_check_item } = require("../models");
const db = require("../models");
const Wm_check = db.wm_check;
const Wm_check_item = db.wm_check_item;
const Wm_check_ng = db.wm_check_ng;
const Wm_check_improvement = db.wm_check_improvement;
const Notif = db.notif;
const Op = db.Sequelize.Op;

// Create and Save a new Machine
exports.create = async (req, res) => {
  // Validate request

  const wm_check = {
      inspection_lot_qty: req.body.inspection_lot_qty,
      inspection_qty: req.body.inspection_qty,
      inspection_group: req.body.inspection_group,
      inspection_line: req.body.inspection_line,
      inspection_lot_ke: req.body.inspection_lot_ke,
      inspection_status: req.body.inspection_status,
      inspection_sn: req.body.inspection_sn,
      inspection_date: req.body.inspection_date,
      inspection_approval: 1,
      inspection_id: req.body.inspection_id,
      wm_type_id: req.body.wm_type_id,
      wm_model_id: req.body.wm_model_id,
      shift_id: req.body.shift_id,
      supervisor_id: req.body.supervisor_id,
    };

    let createWmCheck = await Wm_check.create(wm_check);
    //console.log(createWmCheck)
    try {
      let wm_check_item = req.body.wm_check_item;
      let wm_check_ng = req.body.wm_check_ng;
      let wm_check_improvement = req.body.wm_check_improvement;
      let supervisor_id = req.body.supervisor_id;
      let serialnumber = req.body.inspection_sn;

      if (wm_check_item.length > 0) {
        wm_check_item.map(async (values) => {
          var data_items = {
            wm_check_id: createWmCheck.id,
            wm_item_check_id: values.wm_item_check_id,
            status: values.status,
            check_value: values.check_value,
          };

          const createWmCheckItem = await Wm_check_item.create(data_items);
        });
      }

      if (wm_check_ng.length > 0) {
        wm_check_ng.map(async (values) => {
          var data_problem = {
            wm_check_id: createWmCheck.id,
            sn: serialnumber,
            masalah: values.masalah,
            tindakan: values.tindakan,
            wm_item_check_id: values.wm_item_check_id
          };

          const createWmCheckNg = await Wm_check_ng.create(
            data_problem
          );
        });
      }

      if (wm_check_improvement.length > 0) {
        wm_check_improvement.map(async (values) => {
          var data_improvement = {
            wm_check_id: createWmCheck.id,
            name: values.name,
            standard: values.standard,
            status: (values.status) ? values.status : false,
            is_boolean: true,
            result: values.result,
          };

          let createWmCheckImprovement =
            await Wm_check_improvement.create(data_improvement);

        });
      }

      if (supervisor_id) {
        await Notif.create({
          user_id: supervisor_id,
          title: `Form outgoing ${req.body.wm_type_id}, ${req.body.wm_model_id}`,
          messages: `Form outgoing ${req.body.wm_type_id} telah selesai dilakukan. silakan direview sebelum di approve`,
          is_read: false,
        });
      }

      /* res.send({
        message: "Create outgoing washing machine check success",
      }); */

      sequelize.query("CALL cp_report_wm_check()").then((v) => {
        res.send({
          message: "Create outgoing washing machine check success",
        });
      }); 
    } catch (error) {
      console.log(error);
    } 
  
};

// Update a Machine by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Wm_check.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        sequelize.query("CALL cp_report_wm_check()").then((v) => {
          res.send({
            message: "Approval outgoing washing machine check success.",
          });
        });
      } else {
        res.send({
          message: `Cannot update washing-machine-check with id=${id}. Maybe washing-machine-check was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating washing-machine-check with id=" + id,
      });
    });
};
