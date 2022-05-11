module.exports = (sequelize, Sequelize) => {
  const Report_wm_check = sequelize.define("report_wm_check", {
    wm_check_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    wm_type_id: {
      type: Sequelize.INTEGER,
    },
    wm_model_id: {
      type: Sequelize.INTEGER,
    },
    inspection_id: {
      type: Sequelize.INTEGER,
    },
    supervisor_id: {
      type: Sequelize.INTEGER,
    },
    wm_type_name: {
      type: Sequelize.STRING,
    },
    wm_model_name: {
      type: Sequelize.STRING,
    },
    inspection_lot_qty: {
      type: Sequelize.INTEGER,
    },
    inspection_qty: {
      type: Sequelize.INTEGER,
    },
    inspection_group: {
      type: Sequelize.STRING,
    },
    inspection_line: {
      type: Sequelize.STRING,
    },
    inspection_lot_ke: {
      type: Sequelize.INTEGER,
    },
    inspection_status: {
      type: Sequelize.STRING,
    },
    inspection_sn: {
      type: Sequelize.STRING,
    },
    inspection_date: {
      type: Sequelize.DATE,
    },
    inspection_approval: {
      type: Sequelize.BOOLEAN,
    },
    supervisor_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    supervisor_approval: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    inspection_name: {
      type: Sequelize.STRING,
    },
    inspection_username: {
      type: Sequelize.STRING,
    },
    supervisor_name: {
      type: Sequelize.STRING,
    },
    supervisor_username: {
      type: Sequelize.STRING,
    },
    jumlah_item_ok: {
      type: Sequelize.INTEGER,
    },
    jumlah_item_ng: {
      type: Sequelize.INTEGER,
    },
    total_check_item: {
      type: Sequelize.INTEGER,
    },
    jumlah_detail_ng: {
      type: Sequelize.INTEGER,
    },
    jumlah_improvement: {
      type: Sequelize.INTEGER,
    },
    photo_name: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return Report_wm_check;
};
