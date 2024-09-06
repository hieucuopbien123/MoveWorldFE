FROM node:18.10.0-alpine

WORKDIR /app

COPY .. .

CMD ["yarn", "start"]