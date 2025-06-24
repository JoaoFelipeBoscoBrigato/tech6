# Testes End-to-End (E2E) - Guia Completo

## 📋 Visão Geral

Este projeto possui uma suíte completa de testes E2E implementada com Cypress, cobrindo todos os requisitos solicitados:

### ✅ Requisitos Atendidos

1. **Testes de Login**

   - ✅ Caso de sucesso
   - ❌ Caso de falha (credenciais inválidas)

2. **Testes de Criação de Usuário**

   - ✅ Caso de sucesso
   - ❌ Caso de falha (dados inválidos)

3. **CRUD Completo - Eventos**

   - ✅ Criar evento
   - ✅ Listar eventos
   - ✅ Visualizar detalhes
   - ✅ Editar evento
   - ✅ Excluir evento
   - ❌ Casos de falha

4. **CRUD Completo - Assinaturas**
   - ✅ Criar assinatura
   - ✅ Listar assinaturas
   - ✅ Visualizar detalhes
   - ✅ Atualizar assinatura
   - ✅ Cancelar assinatura
   - ❌ Casos de falha

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Backend rodando**

   ```bash
   cd back
   npm run dev
   ```

2. **Frontend rodando**

   ```bash
   cd front
   npm run dev
   ```

3. **Instalar dependências do Cypress**
   ```bash
   npm install
   ```

### Comandos de Execução

```bash
# Abrir interface gráfica do Cypress
npm run cypress:open

# Executar todos os testes em modo headless
npm run test:e2e

# Executar testes com interface gráfica
npm run test:e2e:headed

# Executar testes em navegador específico
npm run test:e2e:chrome
npm run test:e2e:firefox
```

## 📁 Estrutura dos Arquivos

```
tech6/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.ts              # Testes de login
│   │   ├── user-registration.cy.ts  # Testes de registro
│   │   ├── events-crud.cy.ts        # CRUD de eventos
│   │   ├── signatures-crud.cy.ts    # CRUD de assinaturas
│   │   └── example.cy.ts            # Exemplo básico
│   ├── support/
│   │   ├── e2e.ts                   # Comandos customizados
│   │   └── commands.ts              # Comandos auxiliares
│   ├── tsconfig.json                # Config TypeScript
│   └── README.md                    # Documentação
├── cypress.config.ts                # Configuração principal
├── cypress.env.json                 # Variáveis de ambiente
└── package.json                     # Scripts de teste
```

## 🧪 Cenários de Teste Implementados

### Login (`login.cy.ts`)

- ✅ Login com credenciais válidas
- ❌ Login com credenciais inválidas
- ❌ Validação de campos vazios
- ❌ Validação de formato de email inválido
- ✅ Navegação para página de registro

### Registro de Usuário (`user-registration.cy.ts`)

- ✅ Registro com dados válidos
- ❌ Registro com email já existente
- ❌ Validação de campos obrigatórios
- ❌ Validação de formato de email inválido
- ❌ Validação de CPF inválido
- ❌ Validação de senha fraca
- ✅ Navegação para página de login

### CRUD de Eventos (`events-crud.cy.ts`)

- ✅ Criar evento com dados válidos
- ❌ Criar evento com campos obrigatórios vazios
- ❌ Criar evento com data no passado
- ✅ Listar todos os eventos
- ✅ Visualizar detalhes de evento específico
- ❌ Acessar evento inexistente
- ✅ Editar evento (proprietário)
- ❌ Tentar editar evento (não proprietário)
- ❌ Validação ao editar com dados inválidos
- ✅ Excluir evento (proprietário)
- ❌ Tentar excluir evento (não proprietário)
- ✅ Cancelar exclusão de evento

### CRUD de Assinaturas (`signatures-crud.cy.ts`)

- ✅ Criar assinatura com plano e pagamento
- ❌ Criar assinatura sem selecionar plano
- ❌ Criar assinatura sem método de pagamento
- ❌ Criar assinatura com cartão inválido
- ✅ Listar assinaturas do usuário
- ✅ Visualizar detalhes de assinatura
- ❌ Listar assinaturas (usuário sem assinaturas)
- ✅ Atualizar plano de assinatura
- ✅ Renovar assinatura
- ❌ Atualizar assinatura expirada
- ✅ Cancelar assinatura
- ✅ Cancelar processo de cancelamento
- ❌ Tentar cancelar assinatura já cancelada
- ✅ Verificar status de assinatura (Ativa/Expirada/Cancelada)

## 🔧 Configuração

### Data Attributes

Os testes utilizam data attributes para seletores estáveis. Adicione estes atributos aos componentes:

```tsx
// Login
<input data-cy="email-input" />
<input data-cy="password-input" />
<button data-cy="login-button" />
<p data-cy="error-message" />

// Registro
<input data-cy="name-input" />
<input data-cy="email-input" />
<input data-cy="cpf-input" />
<input data-cy="password-input" />
<button data-cy="register-button" />

// Eventos
<input data-cy="title-input" />
<input data-cy="description-input" />
<input data-cy="date-input" />
<input data-cy="location-input" />
<button data-cy="create-event-button" />
<button data-cy="edit-event-button" />
<button data-cy="delete-event-button" />

// Assinaturas
<button data-cy="plan-basic" />
<button data-cy="plan-premium" />
<button data-cy="payment-credit-card" />
<button data-cy="create-signature-button" />
```

### Comandos Customizados

```typescript
// Login
cy.login('email@example.com', 'password');

// Registro
cy.register({
  name: 'John Doe',
  email: 'john@example.com',
  cpf: '12345678901',
  password: 'password123',
});

// Logout
cy.logout();

// Criar evento
cy.createEvent({
  title: 'Test Event',
  description: 'Test description',
  date: '2024-12-25',
  location: 'Test Location',
});

// Criar assinatura
cy.createSignature({
  plan: 'basic',
  paymentMethod: 'credit-card',
});
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Testes falhando por timeout**

   - Verifique se o backend e frontend estão rodando
   - Aumente o timeout no `cypress.config.ts`

2. **Elementos não encontrados**

   - Verifique se os data attributes estão corretos
   - Confirme se a página carregou completamente

3. **Erros de autenticação**
   - Verifique se o token está sendo salvo corretamente
   - Confirme se as rotas estão protegidas

### Logs e Debug

```bash
# Executar com logs detalhados
DEBUG=cypress:* npm run test:e2e

# Executar teste específico
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

## 📊 Relatórios

Os testes geram:

- Screenshots automáticos em caso de falha
- Vídeos (desabilitados por padrão)
- Logs detalhados no console

## 🔄 Manutenção

### Adicionando Novos Testes

1. Crie novo arquivo em `cypress/e2e/`
2. Adicione data attributes aos componentes
3. Atualize comandos customizados se necessário
4. Execute os testes para validar

### Atualizando Testes Existentes

1. Modifique o arquivo de teste
2. Atualize seletores se a interface mudou
3. Execute testes específicos para validar
4. Atualize documentação se necessário

## 📝 Notas Importantes

- Os testes assumem que o backend está rodando na porta 3000
- Os testes assumem que o frontend está rodando na porta 5173
- Dados de teste são fictícios e devem ser consistentes
- Testes de autenticação requerem usuários válidos no banco
- Alguns testes dependem de dados pré-existentes

## 🎯 Próximos Passos

1. Adicionar data attributes aos componentes restantes
2. Implementar testes para outras funcionalidades
3. Configurar CI/CD para execução automática
4. Adicionar testes de performance
5. Implementar testes de acessibilidade
