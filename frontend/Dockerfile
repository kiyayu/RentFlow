FROM node:24-bookworm-slim AS build

ARG VITE_API_BASE_URL
ARG VITE_DEFAULT_LANG=en

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DEFAULT_LANG=$VITE_DEFAULT_LANG

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.28-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
