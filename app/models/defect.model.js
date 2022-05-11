module.exports = (sequelize, Sequelize) => {
  const Defect = sequelize.define(
    "defect",
    {
      name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Defect;
};
