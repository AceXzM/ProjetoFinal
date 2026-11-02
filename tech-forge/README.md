# Tech Forge — Cadastro de Usuários

Projeto acadêmico full stack: Express + TypeScript + Sequelize + MySQL; React + Vite + TSX.

## Requisitos
- Node.js 20+ e npm
- Docker Desktop para executar o MySQL (ou MySQL configurado manualmente)

## Como iniciar

1. Na raiz, execute `docker compose up -d` e aguarde o banco ficar saudável (`docker compose ps`).
2. Abra um terminal em `backend`:
   - Copie `.env.example` para `.env` (`copy .env.example .env` no Windows).
   - Execute `npm install` e `npm run dev`.
3. Em outro terminal, vá para `frontend`:
   - Copie `.env.example` para `.env`.
   - Execute `npm install` e `npm run dev`.
4. Acesse http://localhost:5173/cadastro

O banco fica em localhost:3307, para evitar conflito com outro MySQL local. Credenciais do Docker são **apenas de desenvolvimento**.

## Endpoint
`POST http://localhost:3001/api/usuarios`
```json
{"nome":"Maria Souza","email":"maria@example.com","cpf":"52998224725","senha":"Senha@123"}
```
- **201**: sucesso e objeto público do usuário (sem senha ou hash)
- **400**: dados inválidos com erros por campo
- **409**: e-mail ou CPF já cadastrado
- **500**: erro interno genérico

Também disponível: `GET /api/health`.

## Critérios de avaliação
- Campos obrigatórios e validações: `backend/src/routes/users.ts` e `frontend/src/pages/Cadastro.tsx`.
- CPF validado pelo cálculo dos verificadores: `utils/cpf.ts` (back e front).
- Confirmação dupla da senha: `Cadastro.tsx` (somente cliente, nunca persistida).
- Senha criptograficamente protegida: hash bcrypt com fator 12; sem armazenamento em texto simples.
- Encapsulamento: `backend/src/services/Usuario.ts` usa campos privados nativos `#`, construtor com normalização/validação, getters sem setters.
- ORM: `backend/src/models/UserModel.ts` usa Sequelize, tipos e constraints `unique` no banco.
- API protegida contra atributos extras: schema Zod `.strict()`.
- Navegação para rota de login demonstrativa após cadastro bem-sucedido.

## Limitações e produção
- O projeto implementa **cadastro**; autenticação de login não foi solicitada, portanto `/login` é ilustrativo.
- `sequelize.sync()` é conveniente para atividade; produção requer migrations, HTTPS, proteção contra abuso/rate limiting, gestão segura de credenciais e adequação à LGPD (CPF é dado pessoal).
- A validação de CPF testa a estrutura matemática, **não** a existência ou situação cadastral do documento.
- A validação de senha é regra didática; em produção considere políticas de senhas longas, medidor de força e controles contra senhas comprometidas.
