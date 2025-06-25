FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 4173

# Comando para rodar em modo de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"] 