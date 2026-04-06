# Stage 1: Build backend
FROM node:18-alpine AS backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .

EXPOSE 5000

# Stage 2: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Stage 3: Final production image
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY --from=backend /app/backend ./backend

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install serve to host static files
RUN npm install -g serve

EXPOSE 5000
EXPOSE 3000

CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/build -l 3000"]
