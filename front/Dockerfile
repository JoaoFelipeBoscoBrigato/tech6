FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20 AS prod
WORKDIR /app
COPY --from=build /app /app
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"] 