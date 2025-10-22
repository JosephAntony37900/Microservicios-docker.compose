# Usamos la misma imagen base de Node.js
FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copiamos todo (el server.js y la carpeta public)
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Ejecutamos el servidor web
CMD [ "node", "server.js" ]
