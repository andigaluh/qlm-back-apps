module.exports = (sequelize, Sequelize) => {
  const Iqc_history = sequelize.define(
    "iqc_history",
    {
      status: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      }
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Iqc_history;
};
