# Finance API

API REST para gestão de finanças pessoais usando Node.js, Express, Sequelize, PostgreSQL e Docker.

## Scripts

- `npm run dev` - executa o servidor em modo desenvolvimento
- `npm run start` - executa o servidor em produção (aplica migrations automaticamente antes de iniciar)
- `npm run sequelize:migrate` - aplica migrations
- `npm run sequelize:seed` - executa seeders

## Instalação

```bash
npm install
```

## Execução com Docker

```bash
docker-compose up --build
```

## Endpoints principais

- `POST /api/users` - cria usuário
- `POST /api/auth/login` - autentica e retorna access token e refresh token
- `POST /api/auth/refresh` - gera um novo par de tokens a partir do refresh token
- `POST /api/auth/logout` - invalida o refresh token atual
- `GET /api/users/me` - retorna perfil do usuário autenticado
- `POST /api/transactions` - cria transação
- `GET /api/transactions` - lista transações do usuário
- `PUT /api/transactions/:id` - atualiza transação do usuário
- `DELETE /api/transactions/:id` - remove transação do usuário
- `POST /api/billing/checkout/session` - cria sessão Stripe Checkout
- `POST /api/billing/portal/session` - cria sessão Stripe Customer Portal
- `GET /api/billing/catalog/products` - lista produtos ativos sincronizados do Stripe
- `GET /api/billing/catalog/prices` - lista preços sincronizados do Stripe
- `GET /api/billing/subscriptions/me` - retorna assinatura mais recente do usuário autenticado
- `POST /api/webhooks/stripe` - endpoint dedicado para receber webhooks Stripe

Obs.: os endpoints de checkout e portal exigem `Authorization: Bearer <accessToken>`.
Obs.: o endpoint `my-subscription` também exige `Authorization: Bearer <accessToken>`.

## Autenticação com refresh token

O login agora retorna este formato:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "expiresIn": "15m",
    "refreshExpiresIn": "7d",
    "user": {
      "id": 1,
      "name": "User",
      "email": "user@email.com"
    }
  }
}
```

Fluxo esperado no front end:

1. Fazer login em `POST /api/auth/login` e salvar `accessToken` e `refreshToken`.
2. Enviar o `accessToken` no header `Authorization: Bearer <token>` nas rotas protegidas.
3. Quando a API responder `401` por expiração do access token, chamar `POST /api/auth/refresh` com o corpo abaixo.
4. Substituir os dois tokens locais pelos novos valores retornados, porque o refresh token é rotacionado.
5. No logout, chamar `POST /api/auth/logout` com o refresh token atual e limpar o storage local.

Exemplo de refresh:

```json
{
  "refreshToken": "seu-refresh-token"
}
```

## Variáveis de ambiente

- `JWT_SECRET` - segredo do access token
- `JWT_EXPIRES_IN` - validade do access token, padrão `15m`
- `JWT_REFRESH_SECRET` - segredo do refresh token
- `JWT_REFRESH_EXPIRES_IN` - validade do refresh token, padrão `7d`
- `STRIPE_SECRET_KEY` - chave secreta Stripe (teste ou produção)
- `STRIPE_WEBHOOK_SECRET` - segredo de assinatura do webhook Stripe
- `STRIPE_DOMAIN` - domínio de retorno do Checkout/Portal (ex.: `http://localhost:3000`)

## Integração Stripe

Baseado no exemplo oficial do Stripe Checkout + Billing Portal + Webhook.
Também refatorado para o padrão do seu código Next.js: sincronização de catálogo (produtos/preços) e assinaturas em tabelas locais.

1. Configure `.env` com suas chaves Stripe.
2. Garanta que os produtos/preços no Stripe tenham `lookup_key` (ex.: `basic_plan_monthly`).
3. Inicie a API:

```bash
npm run dev
```

4. Em outro terminal, inicie o listener do Stripe CLI para webhook local:

```bash
stripe listen --forward-to localhost:3333/api/webhooks/stripe
```

5. Copie o valor `whsec_...` exibido pelo CLI e preencha `STRIPE_WEBHOOK_SECRET`.

### Exemplo: criar Checkout Session

```bash
curl -X POST http://localhost:3333/api/billing/checkout/session \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "lookupKey": "basic_plan_monthly",
    "quantity": 1,
    "mode": "subscription"
  }'
```

Resposta esperada: URL do Checkout para redirecionar o usuário.

### Exemplo: criar Portal Session

```bash
curl -X POST http://localhost:3333/api/billing/portal/session \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"cs_test_..."}'
```

Resposta esperada: URL do Billing Portal.

Também é possível chamar com corpo vazio quando o usuário já estiver vinculado ao Stripe (`stripeCustomerId` salvo no banco).

### Exemplo: listar produtos

```bash
curl -X GET http://localhost:3333/api/billing/catalog/products
```

### Exemplo: listar preços

```bash
curl -X GET "http://localhost:3333/api/billing/catalog/prices?active=true"
```

Filtrar por produto:

```bash
curl -X GET "http://localhost:3333/api/billing/catalog/prices?active=true&productId=prod_123"
```

### Exemplo: consultar minha assinatura

```bash
curl -X GET http://localhost:3333/api/billing/subscriptions/me \
  -H "Authorization: Bearer <accessToken>"
```

### Testar webhook

Com Stripe CLI ativo, dispare eventos de teste:

```bash
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

A API irá validar assinatura e logar os eventos recebidos.

Quando eventos como `checkout.session.completed` e `customer.subscription.updated` chegam, a API sincroniza automaticamente os campos Stripe no usuário.
No contrato atual, a tabela `Users` mantém apenas `stripeCustomerId`; dados de assinatura ficam em `StripeSubscriptions`.

Eventos aceitos pelo webhook:

- `product.created`
- `product.updated`
- `product.deleted`
- `price.created`
- `price.updated`
- `price.deleted`
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Tabelas sincronizadas:

- `StripeProducts`
- `StripePrices`
- `StripeSubscriptions`

## Migração necessária

Antes de usar o fluxo de refresh token, aplique a nova migration:

```bash
npm run sequelize:migrate
```

Essa etapa também cria as tabelas de catálogo e assinatura Stripe usadas no contrato atual.

## Documentação

Acessar `http://localhost:3333/docs`
