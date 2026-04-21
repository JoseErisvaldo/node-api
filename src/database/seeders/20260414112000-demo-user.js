import bcrypt from "bcryptjs";

export async function up(queryInterface) {
  const passwordHash = await bcrypt.hash("senha123", 10);

  await queryInterface.bulkInsert("Users", [
    {
      name: "Teste Inicial",
      email: "teste@financeapi.com",
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("Users", { email: "teste@financeapi.com" });
}
