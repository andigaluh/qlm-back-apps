module.exports = (sequelize, Sequelize) => {
  const Supplier = sequelize.define(
    "supplier",
    {
      supplier_code: {
        type: Sequelize.STRING,
        unique: true,
      },
      supplier_name: {
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

  return Supplier;
};
