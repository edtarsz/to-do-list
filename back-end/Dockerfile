# Stage 1: Build
FROM node:22.19.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration=production

# Stage 2: Serve con nginx
FROM nginx:alpine

COPY --from=build /app/dist/front-end/browser /usr/share/nginx/html

# Configuración de nginx para Angular
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    \
    # Headers de seguridad \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Caché para assets \
    location ~* \\.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]