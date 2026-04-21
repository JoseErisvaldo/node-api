import { Model, DataTypes } from "sequelize";

class StripePrice extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        unitAmount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        interval: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        intervalCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        trialPeriodDays: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        nickname: {
          type: DataTypes.STRING,
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
        modelName: "StripePrice",
        tableName: "StripePrices",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.StripeProduct, {
      foreignKey: "productId",
      as: "product",
    });

    this.hasMany(models.StripeSubscription, {
      foreignKey: "priceId",
      as: "subscriptions",
    });
  }
}

export default StripePrice;
