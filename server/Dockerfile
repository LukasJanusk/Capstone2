# docker build --platform=linux/amd64 -t my-server -f server/Dockerfile .

FROM node:20.14.0-alpine3.20 as builder

WORKDIR /app
COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci
COPY ./server ./server
WORKDIR /app/server
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "prod"]

