# This is a multi-stage Dockerfile. The first stage is the base stage, which
# is used to install the dependencies and build the application. The second
# stage is the production stage, which is used to run the application.

FROM node:alpine3.20 as base
RUN mkdir -p /app/node_modules
WORKDIR /app
COPY . ./
RUN chown -R node:node /app
USER node
RUN npm install
RUN npm run build

FROM node:alpine3.20 as production
RUN mkdir -p /app/ && chown -R node:node /app/
WORKDIR /app
COPY --from=base /app/dist/index.js /app/package*.json /app/
EXPOSE 3080
USER node
CMD ["node", "index.js"]
