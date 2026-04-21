export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'DROP TABLE IF EXISTS "StripeWebhookEvents";',
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.createTable("StripeWebhookEvents", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    stripeEventId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    eventType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    payload: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    processedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NOW()"),
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
