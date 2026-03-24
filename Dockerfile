FROM node:20-alpine AS build

WORKDIR /app

COPY . ./
RUN npm ci

RUN npx quasar build -m pwa

FROM nginx:1.27-alpine AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/pwa/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
