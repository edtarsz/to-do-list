FROM node:22.19.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/front-end/browser /usr/share/nginx/html/browser

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto por defecto de Nginx
EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]