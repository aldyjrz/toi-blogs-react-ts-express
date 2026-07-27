FROM node:20-alpine AS base
 
# Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
