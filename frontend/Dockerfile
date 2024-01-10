FROM node:21

ENV CHOKIDAR_USEPOLLING true

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn --silent
RUN yarn global add @angular/cli --silent

COPY . .

EXPOSE 4200

CMD ["yarn", "dev"]
