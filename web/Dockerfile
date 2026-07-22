# Build BASE
FROM node:18-alpine as BASE

WORKDIR /web
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    && npm install \
    && npm cache clean --force

# Build Image
FROM node:18-alpine AS BUILD

WORKDIR /web
COPY --from=BASE /web/node_modules ./node_modules
COPY . .
RUN apk update && apk add --no-cache git curl \
    && npm run build \
    && cd .next/standalone \
    && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bi \
    && apk del curl

# Build production
FROM node:18-alpine AS PRODUCTION

WORKDIR /web

COPY --from=BUILD /web/public ./public
COPY --from=BUILD /web/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /web/.next/standalone ./
COPY --from=BUILD /web/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
