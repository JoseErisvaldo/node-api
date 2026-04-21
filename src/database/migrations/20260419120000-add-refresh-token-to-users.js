export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Users", "refreshTokenHash", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Users", "refreshTokenExpiresAt", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Users", "refreshTokenExpiresAt");
  await queryInterface.removeColumn("Users", "refreshTokenHash");
}
