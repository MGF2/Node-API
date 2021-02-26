#get image
FROM node:12-alpine
#variabili d ambiente?

ARG PG_PASSWORD

ENV PG_PASSWORD=phpmypostgres

RUN mkdir /server

WORKDIR /server

RUN apk update && apk upgrade && \
apk add --no-cache bash git openssh

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]