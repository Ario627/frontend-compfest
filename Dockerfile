# ============================================
# STAGE 1: Build aplikasi React dengan Vite
# ============================================
FROM node:20-alpine AS builder

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan Docker layer caching - jika dependencies tidak berubah,
# layer ini tidak perlu di-build ulang
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies untuk build)
RUN npm ci

# Copy semua source code
COPY . .

# Build aplikasi untuk production
# Output akan ada di folder /app/dist
RUN npm run build

# ============================================
# STAGE 2: Production - Serve dengan Nginx
# ============================================
FROM nginx:alpine AS production

# Copy hasil build dari stage builder ke folder nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy konfigurasi nginx custom (opsional, akan dibuat nanti)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default nginx)
EXPOSE 80

# Jalankan nginx di foreground
CMD ["nginx", "-g", "daemon off;"]