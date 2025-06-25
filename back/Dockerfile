FROM node:20-alpine

# Instalar curl e bash
RUN apk add --no-cache curl bash

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build && ls -l dist && test -f dist/index.js

# Remover dependências de desenvolvimento após o build
RUN npm prune --production

# Copiar script de espera
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Criar pasta de uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["bash", "/wait-for-it.sh", "db:3306", "--", "node", "dist/index.js"] 