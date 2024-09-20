FROM node:20-bullseye-slim as base

ENV NODE_ENV production

RUN apt-get update

# Installation des dépendances

FROM base as deps

WORKDIR /app

ADD package.json ./
RUN npm install --include=dev
RUN npm install -g serve

# Setup production

FROM base as production-deps

WORKDIR /app

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json ./
RUN npm prune --omit=dev


# Build
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .

RUN npm run build


# Build l'image de prod
FROM base

ENV NODE_ENV="production"

WORKDIR /app

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/start.sh /app/start.sh

# ENTRYPOINT [ "./start.sh" ]

CMD ["serve", "-s", "dist"]