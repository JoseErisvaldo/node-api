import { Model, DataTypes } from "sequelize";

class StripeProduct extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        image: {
          type: DataTypes.TEXT,
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
        modelName: "StripeProduct",
        tableName: "StripeProducts",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    this.hasMany(models.StripePrice, {
      foreignKey: "productId",
      as: "prices",
    });
  }
}

export default StripeProduct;
