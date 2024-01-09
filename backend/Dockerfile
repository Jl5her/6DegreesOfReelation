# pull official base image
FROM oven/bun

ENV CHOKIDAR_USEPOLLING true

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json bun.lockb ./
RUN bun install

# add app
COPY . ./

EXPOSE 80

CMD ["bun", "dev"]