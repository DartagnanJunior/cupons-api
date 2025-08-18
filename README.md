# cupons-api

## English

A RESTful API for managing coupon books, codes, and user assignments, built with Fastify, Knex, and SQLite.

### Features

- Manage users and coupon books
- Generate and assign codes to users
- Redeem and lock codes
- Scheduled tasks for unlocking expired codes

### Technologies

- Node.js
- Fastify
- Knex.js
- SQLite
- TypeScript


### Postman Collection

A Postman collection is available in the repository (`cupons-postman-collection`) to help you test the API endpoints easily.

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in a `.env` file:
   ```
   DATABASE_URL=./db/app.db
   PORT=3333
   NODE_ENV=development
   ```
3. Run database migrations:
   ```bash
   npx knex migrate:latest
   ```
4. Start the server:
   ```bash
   npm run dev
   ```


### API Endpoints

- `POST /users` — Create a user
- `GET /users` — List users
- `GET /users/:id` — Get user by ID
- `GET /users/:id/codes` — List codes assigned to a user
- `POST /coupons` — Create a coupon book and generate codes
- `GET /coupons` — List coupon books
- `POST /coupons/assign` — Assign codes to users
- `POST /coupons/redeem` — Redeem a code
- `POST /coupons/lock` — Lock a code or coupon book

(See source code for more endpoints.)

---

## Português (Brasil)

Uma API RESTful para gerenciar livros de cupons, códigos e atribuição de usuários, construída com Fastify, Knex e SQLite.

### Funcionalidades

- Gerenciamento de usuários e livros de cupons
- Geração e atribuição de códigos para usuários
- Resgate e bloqueio de códigos
- Tarefas agendadas para desbloquear códigos expirados

### Tecnologias

- Node.js
- Fastify
- Knex.js
- SQLite
- TypeScript


### Collection do Postman

Uma collection do Postman está disponível no repositório (`cupons-postman-collection`) para facilitar o teste dos endpoints da API.

### Como começar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente em um arquivo `.env`:
   ```
   DATABASE_URL=./db/app.db
   PORT=3333
   NODE_ENV=development
   ```
3. Rode as migrations do banco de dados:
   ```bash
   npx knex migrate:latest
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Endpoints da API

- `POST /users` — Criar usuário
- `GET /users` — Listar usuários
- `GET /users/:id` — Buscar usuário por ID
- `GET /users/:id/codes` — Listar códigos atribuídos a um usuário
- `POST /coupons` — Criar livro de cupons e gerar códigos
- `GET /coupons` — Listar livros de cupons
- `POST /coupons/assign` — Atribuir códigos a usuários
- `POST /coupons/redeem` — Resgatar um código
- `POST /coupons/lock` — Bloquear um código ou livro de cupons

(Veja o código-fonte para mais endpoints.)
