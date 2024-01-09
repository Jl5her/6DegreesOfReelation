FROM mongo:latest

ENV MONGO_INITDB_DATABASE mongoose-app

COPY ./init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js

HEALTHCHECK --interval=10s --timeout=10s --start-period=40s --retries=5 CMD [ "echo 'db.runCommand("ping").ok' | mongo mongo:27017/mongoose-app --quiet" ]

CMD ["--bind_ip", "0.0.0.0"]

EXPOSE 27017