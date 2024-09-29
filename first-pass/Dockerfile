FROM node:lts-iron

RUN useradd -ms /bin/sh -u 1001 app
USER app

COPY --chown=app:app . /app
WORKDIR /app

RUN npm install