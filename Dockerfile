FROM node:12-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/

ENV NODE_ENV=production
RUN npm ci --only=production

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
