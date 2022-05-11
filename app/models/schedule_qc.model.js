module.exports = (sequelize, Sequelize) => {
  const Schedule_qc = sequelize.define(
    "schedule_qc",
    {
      objective: {
        type: Sequelize.STRING,
      },
      activity: {
        type: Sequelize.STRING,
      },
      plan_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      photo_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      photo_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Schedule_qc;
};
