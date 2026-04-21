export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("StripeProducts", {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });

  await queryInterface.createTable("StripePrices", {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "StripeProducts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unitAmount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    interval: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    intervalCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    trialPeriodDays: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });

  await queryInterface.createTable("StripeSubscriptions", {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    customerId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priceId: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: "StripePrices",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cancelAtPeriodEnd: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cancelAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    canceledAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    currentPeriodStart: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    currentPeriodEnd: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    trialStart: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    trialEnd: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("StripeSubscriptions");
  await queryInterface.dropTable("StripePrices");
  await queryInterface.dropTable("StripeProducts");
}
