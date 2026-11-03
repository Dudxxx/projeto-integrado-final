# AGENTS.md — Barbearia Agenda

## Objetivo
Sistema de agendamento de uma barbearia com frontend React + TypeScript, backend Node.js + TypeScript, MySQL e Nginx.

## Guardrails obrigatórios
1. Nunca abrir, ler, imprimir ou incluir conteúdo de `.env`, chaves JWT, senhas do banco ou outros segredos em respostas, logs ou commits.
2. Nunca substituir autenticação por dados fixos, tokens falsos ou senhas em texto puro.
3. Toda rota privada deve validar JWT no backend.
4. Toda entrada do usuário deve ser validada no backend; validação no frontend é apenas UX.
5. Toda consulta com dados fornecidos pelo usuário deve usar parâmetros preparados; não concatenar valores em SQL.
6. Não expor a porta do backend. O Nginx é o único serviço HTTP público no compose principal.
7. Não excluir ou alterar dados de produção sem confirmação explícita.
8. Manter o banco com volume persistente.
9. O horário de agendamento é protegido por restrição de banco e transação; nunca confiar apenas no frontend para evitar duplicidade.
10. Não usar `any` no TypeScript sem justificativa técnica documentada.

## Arquivos sensíveis
- `.env`
- `.env.*` exceto `.env.example`
- certificados e chaves privadas
- dumps de banco contendo credenciais

## Skills específicas dos agentes
- `.agents/skills/backend-api/SKILL.md`
- `.agents/skills/frontend-react/SKILL.md`
- `.agents/skills/security-auth/SKILL.md`

## Regra de alteração
Antes de alterar código, entender a separação em entidades, repositórios, serviços, rotas, páginas, componentes e contexto de autenticação.
