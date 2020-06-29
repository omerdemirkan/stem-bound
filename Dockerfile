FROM node:12.16.1-slim

WORKDIR /usr/src/stem-bound

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]