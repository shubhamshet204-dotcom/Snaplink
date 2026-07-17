# Stage 1: Build React static assets
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Set build environment variables so Vite embeds them
ARG VITE_API_BASE_URL=http://localhost:8082/api
ARG VITE_SHORT_LINK_BASE_URL=http://localhost:8082
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SHORT_LINK_BASE_URL=$VITE_SHORT_LINK_BASE_URL

RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
