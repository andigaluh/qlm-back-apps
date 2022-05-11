module.exports = (sequelize, Sequelize) => {
  const Supplier_excel = sequelize.define(
    "supplier_excel",
    {
      file_name: {
        type: Sequelize.STRING,
      },
    },
    {
      initialAutoIncrement: 1000,
    }
  );

  return Supplier_excel;
};
