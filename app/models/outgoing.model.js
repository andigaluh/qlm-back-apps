module.exports = (sequelize, Sequelize) => {
  const Outgoing = sequelize.define(
    "outgoing",
    {
      model_name: {
        type: Sequelize.STRING,
      },
      serial_no: {
        type: Sequelize.STRING,
      },
      lot_number: {
        type: Sequelize.STRING,
      },
      total_qty: {
        type: Sequelize.INTEGER,
      },
      note_remark: {
        type: Sequelize.STRING,
      },
      barcode: {
        type: Sequelize.STRING,
      },
      date_check: {
        type: Sequelize.DATE
      }
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Outgoing;
};
