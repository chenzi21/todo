FROM node:18-alpine AS installer

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=installer ./app ./
COPY . .

EXPOSE 80
EXPOSE 443

CMD ["npm", "run", "dev"]