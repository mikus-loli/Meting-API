FROM node:23-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:23-alpine3.20
WORKDIR /app

ARG UID=1010
ARG GID=1010
ARG PORT=3000

ENV UID=${UID}
ENV GID=${GID}
ENV PORT=${PORT}

RUN apk add --no-cache su-exec \
    && addgroup -g ${GID} --system meting \
    && adduser -G meting --system -D -s /bin/sh -u ${UID} meting

COPY --from=builder /app /app

RUN chmod +x /app/docker-entrypoint.sh \
    && mkdir -p /app/data \
    && chown -R meting:meting /app

ENTRYPOINT ["/app/docker-entrypoint.sh"]

EXPOSE ${PORT}

CMD ["node", "/app/node.js"]
