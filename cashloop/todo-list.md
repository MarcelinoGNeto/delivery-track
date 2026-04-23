# 🚀 CASHLOOP — ROADMAP (Next.js + Mongo)

---

## 🧱 ÉPICO 0 — Fundação

* [x] Criar projeto com Next.js (App Router + TS)
* [x] Configurar TailwindCSS
* [x] Configurar ESLint
* [x] Criar estrutura de pastas
* [x] Configurar `.env.local`
* [x] Instalar mongoose
* [x] Criar conexão com Mongo (`lib/mongodb.ts`)
* [x] Testar conexão com API `/api/test`
* [x] Instalar React Query
* [x] Configurar Providers (QueryClientProvider)

---

## 🔐 ÉPICO 1 — Autenticação + RBAC

* [ ] Criar model `User`
* [ ] Implementar hash de senha (bcrypt)
* [ ] Criar endpoint `/api/auth/login`
* [ ] Gerar JWT (com role + tenantId)
* [ ] Criar middleware de autenticação (Next)
* [ ] Proteger rotas privadas
* [ ] Criar hook `useAuth()`
* [ ] Persistir sessão (token)
* [ ] Implementar logout
* [ ] Redirecionamento por role:

  * [ ] SUPER_ADMIN → `/admin/global`
  * [ ] TENANT_ADMIN → `/admin`
  * [ ] OPERATOR → `/cashier`

---

## 🏢 ÉPICO 2 — Multi-tenant

* [ ] Criar model `Tenant`
* [ ] Criar relação `User.tenantId`
* [ ] Criar tenants via API
* [ ] Middleware para extrair tenant do token
* [ ] Garantir isolamento em todas queries (`tenantId`)
* [ ] Criar contexto global de tenant (frontend)
* [ ] Testar isolamento entre tenants

---

## 👑 ÉPICO 3 — Super Admin

* [ ] Tela listar tenants
* [ ] Criar tenant
* [ ] Criar TENANT_ADMIN
* [ ] Definir plano do tenant
* [ ] Ativar/desativar tenant

---

## 👥 ÉPICO 4 — Gestão de Usuários

* [ ] Criar usuário (OPERATOR)
* [ ] Listar usuários do tenant
* [ ] Alterar role
* [ ] Reset de senha
* [ ] Validação por tenant

---

## 👤 ÉPICO 5 — Clientes (CORE)

* [ ] Criar model `Customer`
* [ ] Criar endpoint CRUD
* [ ] Criar índice `{ tenantId, phone }`
* [ ] Buscar cliente por telefone
* [ ] Criar cliente
* [ ] Exibir saldo
* [ ] Integrar com React Query
* [ ] Loading + error states

---

## 💰 ÉPICO 6 — Cashback Engine

* [ ] Criar model `Transaction`
* [ ] Criar endpoint gerar cashback
* [ ] Criar endpoint usar saldo
* [ ] Implementar regra de % cashback
* [ ] Implementar limite por operação
* [ ] Garantir saldo nunca negativo
* [ ] Usar `$inc` para atualização atômica
* [ ] Registrar operador na transação
* [ ] Validar tenant em todas operações

---

## 🧾 ÉPICO 7 — Caixa (MVP)

* [ ] Criar tela `/cashier`
* [ ] Input telefone
* [ ] Buscar cliente (React Query)
* [ ] Criar cliente
* [ ] Input valor
* [ ] Botão gerar cashback
* [ ] Botão usar saldo
* [ ] Feedback visual (sucesso/erro)
* [ ] Loading states
* [ ] Botão logout

---

## 📊 ÉPICO 8 — Dashboard

* [ ] KPIs:

  * [ ] Total cashback gerado
  * [ ] Total cashback usado
  * [ ] Total clientes
* [ ] Listagem de transações
* [ ] Filtro por período
* [ ] Filtro por cliente

---

## 📱 ÉPICO 9 — Área do Cliente

* [ ] Página pública
* [ ] Input telefone
* [ ] Consulta de saldo
* [ ] Histórico de transações

---

## 🛡️ ÉPICO 10 — Segurança

* [ ] Middleware JWT global
* [ ] Validação de tenant em todas rotas
* [ ] Logs de operações
* [ ] Limite por operação
* [ ] Limite diário
* [ ] Auditoria por operador

---

## 📢 ÉPICO 11 — Campanhas

* [ ] Criar model `Campaign`
* [ ] Criar campanha
* [ ] Ativar/desativar
* [ ] Definir validade
* [ ] Aplicar regra no cashback

---

## ⚙️ ÉPICO 12 — Deploy

* [ ] Configurar variáveis de ambiente (prod)
* [ ] Deploy na Vercel
* [ ] Configurar Mongo Atlas (prod)
* [ ] Configurar domínio
* [ ] Testar ambiente real

---

## 🧪 ÉPICO 13 — Cliente Piloto

* [ ] Escolher cliente real
* [ ] Criar tenant real
* [ ] Treinar uso
* [ ] Observar comportamento
* [ ] Ajustar UX

---

## 💰 ÉPICO 14 — SaaS

* [ ] Criar planos
* [ ] Criar onboarding
* [ ] Criar landing page
* [ ] Fechar primeiros clientes

---

# 🔥 PRIORIDADE (NÃO SE PERDER)

* [ ] ÉPICO 1 — Auth
* [ ] ÉPICO 2 — Tenant
* [ ] ÉPICO 7 — Caixa
* [ ] ÉPICO 6 — Cashback
