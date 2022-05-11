module.exports = (sequelize, Sequelize) => {
  const Wm_check = sequelize.define("wm_check", {
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
    },
    supervisor_approval: {
      type: Sequelize.BOOLEAN,
    },
    photo_name: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return Wm_check;
};
