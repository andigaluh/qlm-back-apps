module.exports = (sequelize, Sequelize) => {
  const Iqc = sequelize.define(
    "iqc",
    {
      iqc_date: {
        type: Sequelize.DATE,
      },
      incoming_qty: {
        type: Sequelize.INTEGER,
      },
      sampling_qty: {
        type: Sequelize.INTEGER,
      },
      ng_qty: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      sorting_lot: {
        type: Sequelize.STRING,
      },
      sorting_ok: {
        type: Sequelize.INTEGER,
      },
      sorting_ng: {
        type: Sequelize.INTEGER,
      },
      detail_problem: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      action_qty: {
        type: Sequelize.INTEGER,
      },
      image_sheet: {
        type: Sequelize.STRING,
      },
      photo_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      actual: {
        type: Sequelize.STRING,
        allowNull: true
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Iqc;
};
