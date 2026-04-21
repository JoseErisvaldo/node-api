export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "stripeCustomerId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Users", "stripeCustomerId");
}
