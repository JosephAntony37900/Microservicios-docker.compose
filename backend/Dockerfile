# Usamos una imagen base oficial de Node.js (versión LTS)
# No usamos 'alpine' para ser más robustos, cumpliendo el requisito.
FROM node:18-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto 5000 que definimos en server.js
EXPOSE 5000

# El comando para iniciar la aplicación
CMD [ "node", "server.js" ]
