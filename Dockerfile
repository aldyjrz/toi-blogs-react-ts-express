FROM node:20-alpine AS base

# Backend
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
RUN npm run prisma:generate
RUN npm run build

FROM base AS backend
WORKDIR /app/backend
ENV NODE_ENV=production
COPY backend/package.json ./
RUN npm install --only=production
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
EXPOSE 4000
CMD ["sh", "-c", "npm run prisma:deploy && npm start"]

# Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
