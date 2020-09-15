FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ./build ./public

RUN mkdir server

WORKDIR /usr/src/app/server

COPY ./server ./

RUN npm install

EXPOSE 8080

CMD ["node", "index.js"]