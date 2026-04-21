import { Model, DataTypes } from "sequelize";

class StripeSubscription extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        customerId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        priceId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cancelAtPeriodEnd: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        cancelAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        canceledAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        currentPeriodStart: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        currentPeriodEnd: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        trialStart: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        trialEnd: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: "StripeSubscription",
        tableName: "StripeSubscriptions",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    this.belongsTo(models.StripePrice, {
      foreignKey: "priceId",
      as: "price",
    });
  }
}

export default StripeSubscription;
