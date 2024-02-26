FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

FROM base AS prod-deps
RUN pnpm install --prod

FROM base AS build-deps
RUN pnpm install

FROM base as build

COPY --from=build-deps /app/node_modules /app/node_modules
RUN pnpm run build

FROM base as runner

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src/public/ ./public

EXPOSE 80
EXPOSE 443

CMD [ "pnpm", "start" ]