import { Model, DataTypes } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        refreshTokenHash: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        refreshTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        stripeCustomerId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: "userId",
      as: "transactions",
    });

    this.hasMany(models.StripeSubscription, {
      foreignKey: "userId",
      as: "stripeSubscriptions",
    });
  }
}

export default User;
