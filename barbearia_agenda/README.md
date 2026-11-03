# Barbearia Agenda

Sistema completo de agendamento para uma barbearia.

## Stack
- React + TypeScript + Vite
- Node.js + Express + TypeScript
- MySQL 8
- Nginx
- Docker Compose
- JWT + bcrypt

## Subir tudo
1. Copie `.env.example` para `.env`.
2. Execute `docker compose up --build`.
3. Abra `http://localhost:8080`.

## DBeaver
Para inspecionar o MySQL pelo DBeaver sem publicar a porta do banco no compose principal:

`docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml up --build`

Conexão DBeaver:
- Host: `127.0.0.1`
- Porta: `3307`
- Banco: `barbearia_agenda`
- Usuário: `barbearia`
- Senha: `barbearia_dev`

## Login de demonstração
- Admin: `admin@barbearia.local`
- Senha: `Admin@123`

## Fluxo principal
Cadastro → login → token JWT no localStorage → área logada → escolha do serviço → escolha de horário disponível → confirmação.

O horário é único por data/hora e é protegido em três níveis: índice UNIQUE no banco, bloqueio transacional `FOR UPDATE` e validação de disponibilidade no serviço.

## APIs
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- PUT `/api/users/me`
- CRUD `/api/services`
- CRUD `/api/barbers`
- CRUD `/api/time-slots`
- CRUD `/api/appointments`

## Banco manual no DBeaver
Os scripts estão em `database/01_schema.sql` e `database/02_seed.sql`.
