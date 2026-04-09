# Etapa 1: Construcción
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:stable-alpine as production-stage

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa de build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer el puerto 80 (interno del contenedor)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
