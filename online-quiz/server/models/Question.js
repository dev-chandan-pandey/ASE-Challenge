module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Question", {
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_a: DataTypes.STRING,
    option_b: DataTypes.STRING,
    option_c: DataTypes.STRING,
    option_d: DataTypes.STRING,
    correct_option: DataTypes.STRING,
  });
};
