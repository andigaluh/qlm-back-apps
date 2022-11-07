module.exports = (sequelize, Sequelize) => {
  const Doc_inspection = sequelize.define(
    "daily_report",
    {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      draft_file_name: {
        type: Sequelize.STRING,
      },
      release_file_name: {
        type: Sequelize.STRING,
      },
      expired_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      type_report: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Doc_inspection;
};
