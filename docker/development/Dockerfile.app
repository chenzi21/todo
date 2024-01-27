FROM node:18-alpine AS installer

WORKDIR /

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install

FROM node:18-alpine as runner

WORKDIR /frontend

RUN apk --no-cache add curl

COPY --from=installer . .
COPY . .

CMD ["npm", "run", "dev"]