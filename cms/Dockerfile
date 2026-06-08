# Build BASE
FROM node:18-alpine3.18 as BASE

WORKDIR /cms
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    && npm install \
    && npm cache clean --force

# Build Image
FROM node:18-alpine3.18 AS BUILD

WORKDIR /cms
COPY --from=BASE /cms/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && npm run build \
    && cd .next/standalone \
    && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bi \
    && apk del curl

# Build production
FROM node:18-alpine3.18 AS PRODUCTION

WORKDIR /cms

COPY --from=BUILD /cms/public ./public
COPY --from=BUILD /cms/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /cms/.next/standalone ./
COPY --from=BUILD /cms/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
