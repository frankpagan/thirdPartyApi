
FROM node:14.15.4-alpine
#FROM docker.pkg.github.com/cocreate-app/cocreateapi/cocreateapi:1.1.13

# Create app directory
RUN mkdir /app
WORKDIR /app

RUN apk add --no-cache chromium 
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install -g nodemon
# Bundle app source
COPY . .

EXPOSE 3002
CMD [ "npm", "run", "dev" ]
