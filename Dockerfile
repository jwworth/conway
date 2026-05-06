FROM node:14-buster AS build

WORKDIR /app

ENV CI=false

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
