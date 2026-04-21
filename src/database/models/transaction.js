import { Model, DataTypes } from "sequelize";

class Transaction extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        type: {
          type: DataTypes.ENUM("income", "expense"),
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Transaction",
        tableName: "Transactions",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

export default Transaction;
