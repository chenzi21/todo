FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps

RUN pnpm install --prod --frozen-lockfile

FROM base AS build

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base as runner

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/public/ ./public  //dont have a public dir so fails, will uncomment if neccesary in the future.

EXPOSE 80
EXPOSE 443

CMD [ "pnpm", "start" ]