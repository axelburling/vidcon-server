FROM node:14

WORKDIR /server

RUN yarn

CMD yarn start