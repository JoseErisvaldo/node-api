export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE "Users" DROP COLUMN IF EXISTS "stripeSubscriptionId";',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE "Users" DROP COLUMN IF EXISTS "stripeSubscriptionStatus";',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE "Users" DROP COLUMN IF EXISTS "stripeCurrentPeriodEnd";',
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "stripeSubscriptionId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  await queryInterface.addColumn("Users", "stripeSubscriptionStatus", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Users", "stripeCurrentPeriodEnd", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}
