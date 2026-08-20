# syntax=docker/dockerfile:1

# ---- build the static site ----
FROM oven/bun:1.3 AS build
WORKDIR /app

# Dependencies first, so this layer is reused until the lockfile changes.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Astro downloads and self-hosts the Google fonts during this step, so the
# build needs network access.
RUN bun run build

# ---- serve it ----
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
