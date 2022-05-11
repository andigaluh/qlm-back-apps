module.exports = (sequelize, Sequelize) => {
  const Schedule_qc_excel = sequelize.define(
    "schedule_qc_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Schedule_qc_excel;
};
