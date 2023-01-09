# Use Node 16 LTS as base image.
FROM node:16.19

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# The node_modules directory is ignored by this COPY command.
# @see .dockerignore
COPY . .

RUN npm run build

# Set the 'docker' NODE_ENV to read accordingly the configuration
ENV NODE_ENV=docker

EXPOSE 3000
CMD [ "npm", "run", "prepare-db-and-start" ]
