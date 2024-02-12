FROM node:lts-slim AS installer

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install

FROM node:lts-slim as runner

WORKDIR /app

COPY --from=installer ./app ./
COPY . .

EXPOSE 80
EXPOSE 443

CMD ["npm", "run", "dev"]