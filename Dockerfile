FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Unprivileged nginx listens on 8080 and runs as an arbitrary non-root user, as OpenShift requires
FROM nginxinc/nginx-unprivileged:1.27-alpine
# Backend serving /api and /data; templates/*.template are envsubst'ed into conf.d at startup
ENV BACKEND_URL=https://solmon.dias.ie
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
