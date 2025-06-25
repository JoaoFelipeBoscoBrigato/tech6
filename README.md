# Tech6 - Projeto Fullstack

Projeto fullstack completo com Docker, Nginx como proxy reverso, MySQL para persistência de dados e integração entre frontend e backend.

## 🏗️ Arquitetura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Nginx     │    │  Frontend   │    │   Backend   │
│  (Port 80)  │◄──►│  (Port 4173)│    │  (Port 3000)│
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │    MySQL    │
                    │  (Port 3307)│
                    └─────────────┘
```

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js (para desenvolvimento local)

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <seu-repositorio>
cd tech6

# Configure as variáveis de ambiente
npm run setup
# ou copie manualmente: cp env.example .env
```

### 2. Iniciar o Projeto

```bash
# Desenvolvimento (com logs)
npm run dev

# Desenvolvimento em background
npm run dev:detached

# Parar os serviços
npm run stop

# Parar e remover volumes
npm run stop:volumes
```

### 3. Verificar Status

```bash
# Verificar health dos serviços
npm run health

# Ver logs em tempo real
npm run logs

# Ver logs de um serviço específico
npm run logs:backend
npm run logs:frontend
npm run logs:db
npm run logs:nginx
```

## 📁 Estrutura do Projeto

```
tech6/
├── back/                 # Backend Node.js
│   ├── src/
│   ├── uploads/         # Arquivos enviados
│   └── scripts/         # Scripts de inicialização
├── front/               # Frontend React
│   └── src/
├── nginx/               # Configuração do Nginx
│   ├── nginx.conf
│   └── conf.d/
├── cypress/             # Testes E2E
├── docker-compose.yml   # Orquestração dos containers
└── env.example          # Exemplo de variáveis de ambiente
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```env
# Database
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=2005
DB_NAME=tech5br

# Backend
JWT_SECRET=SegredoSuperSecreto
BACKEND_PORT=3000

# Frontend
FRONTEND_PORT=4173

# Nginx
NGINX_PORT=80
```

### Portas Utilizadas

- **80**: Nginx (proxy reverso)
- **3000**: Backend API
- **4173**: Frontend (desenvolvimento)
- **3307**: MySQL (acesso externo)

## 🌐 Acessos

Após iniciar o projeto:

- **Frontend**: http://localhost
- **API**: http://localhost/api
- **Health Check**: http://localhost/health
- **Uploads**: http://localhost/uploads

## 🔄 Integração entre Serviços

### Backend → MySQL

- Conexão via Sequelize
- Health checks automáticos
- Persistência de dados com volumes Docker

### Frontend → Backend

- Comunicação via Nginx proxy
- Interceptors para autenticação
- Tratamento automático de erros

### Nginx → Frontend/Backend

- Proxy reverso configurado
- Compressão gzip
- Headers de segurança
- Cache para arquivos estáticos

## 🧪 Testes

```bash
# Executar testes E2E
npm run test:e2e

# Abrir Cypress
npm run test:e2e:open
```

## 🛠️ Comandos Úteis

```bash
# Reiniciar serviços
npm run restart

# Limpar tudo (volumes, containers, imagens)
npm run clean

# Verificar status dos containers
docker-compose ps

# Acessar container específico
docker-compose exec backend sh
docker-compose exec db mysql -u root -p
```

## 📊 Monitoramento

### Health Checks

- **Backend**: http://localhost/health
- **Nginx**: http://localhost
- **MySQL**: Verificado via healthcheck no docker-compose

### Logs

```bash
# Todos os serviços
npm run logs

# Serviço específico
npm run logs:backend
```

## 🔒 Segurança

- Headers de segurança configurados no Nginx
- CORS configurado no backend
- Variáveis de ambiente para configurações sensíveis
- Volumes isolados para persistência

## 🚨 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**

   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep :80
   # Parar serviços conflitantes
   ```

2. **Banco não conecta**

   ```bash
   # Verificar logs do MySQL
   npm run logs:db
   # Verificar variáveis de ambiente
   ```

3. **Frontend não carrega**
   ```bash
   # Verificar logs do frontend
   npm run logs:frontend
   # Verificar se o backend está rodando
   npm run health
   ```

## 📝 Notas de Desenvolvimento

- O projeto usa volumes para persistência de dados
- Nginx atua como proxy reverso e servidor de arquivos estáticos
- Health checks garantem que os serviços estejam funcionando
- Configuração flexível via variáveis de ambiente
- Logs centralizados para facilitar debugging

---

**Desenvolvido com ❤️ usando Docker, Nginx, MySQL e Node.js**
