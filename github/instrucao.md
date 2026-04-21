# 🚀 PROMPT PARA GERAR API COMPLETA (NODE + SEQUELIZE + DOCKER + POSTGRES)

Quero que você gere um projeto backend completo seguindo boas práticas modernas.

## 🎯 Objetivo do projeto

Criar uma API REST para **gestão de finanças pessoais**, com:

- CRUD de usuários
- CRUD de transações financeiras
- Autenticação com JWT
- Documentação com Swagger
- Banco de dados PostgreSQL
- Docker para ambiente completo

---

## 🧱 Stack obrigatória

- Node.js
- Express
- Sequelize (ORM)
- PostgreSQL
- Docker + Docker Compose
- JWT (autenticação)
- Swagger (documentação)
- bcrypt (hash de senha)
- dotenv (variáveis de ambiente)

---

## 📁 Estrutura do projeto (obrigatório seguir)

Crie uma estrutura profissional baseada em camadas:

src/
├── config/
├── database/
│ ├── migrations/
│ ├── models/
│ ├── seeders/
├── modules/
│ ├── users/
│ │ ├── controller.js
│ │ ├── service.js
│ │ ├── repository.js
│ │ ├── routes.js
│ ├── transactions/
│ │ ├── controller.js
│ │ ├── service.js
│ │ ├── repository.js
│ │ ├── routes.js
├── middlewares/
├── utils/
├── app.js
├── server.js

---

## 🐳 Docker (obrigatório)

Crie:

### docker-compose.yml com:

- PostgreSQL
- API Node

Configurar:

- Porta do banco
- Volume persistente
- Variáveis de ambiente

---N

## 🔐 Autenticação

Implementar:

- Registro de usuário
- Login
- JWT Token
- Middleware de autenticação

Rotas protegidas:

- Criar transação
- Listar transações
- Atualizar
- Deletar

---

## 💰 Regras de negócio (FINANCEIRO)

### Entidade: User

- id
- name
- email (único)
- password (hash)
- createdAt

### Entidade: Transaction

- id
- title
- amount
- type (income | expense)
- category
- userId (FK)
- createdAt

---

## 🔁 CRUD obrigatório

### Users:

- POST /users (criar)
- POST /auth/login
- GET /users/me

### Transactions:

- POST /transactions
- GET /transactions
- PUT /transactions/:id
- DELETE /transactions/:id

---

## 🧠 Regras importantes

- Usuário só pode ver suas próprias transações
- Validar dados de entrada
- Senha sempre criptografada
- Token obrigatório nas rotas protegidas

---

## 📄 Swagger

Adicionar documentação Swagger com:

- Todas as rotas
- Exemplos de request/response
- Autenticação via Bearer Token

Endpoint:
GET /docs

---

## 🛠️ Sequelize

Gerar:

- Models
- Migrations
- Relacionamentos:
  - User hasMany Transactions
  - Transaction belongsTo User

---

## ⚙️ Scripts

Adicionar no package.json:

- dev (nodemon)
- start
- sequelize migrate
- sequelize seed

---

## 🌱 Seed (opcional)

Criar usuário inicial para testes

---

## 🚀 Inicialização do projeto

O projeto deve rodar com:

docker-compose up --build

---

## 📌 Extras (se possível)

- Validação com Joi ou Zod
- Logs de erro
- Padronização de respostas (success/error)
- Tratamento global de erros

---

## 🎯 IMPORTANTE

Gere:

1. Todo o código do projeto
2. Arquivos completos (não apenas trechos)
3. Código pronto para rodar
4. Comentários explicando partes importantes

---

Agora gere o projeto completo seguindo TODAS essas regras.
∏∏
