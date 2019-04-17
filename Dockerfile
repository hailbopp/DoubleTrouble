FROM node:10.0.0-alpine

WORKDIR /opt/doubletrouble

# Install dependencies in an earlier layer
RUN apk update && apk add \
    python make
ADD ./package*.json ./
RUN npm install

ADD ./tsconfig.json .
ADD ./webpack.config.js .
# ADD ./src ./src

EXPOSE 9000

CMD ["node", "dist/doubletrouble.server.js"]
