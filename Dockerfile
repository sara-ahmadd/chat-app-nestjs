FROM node:22.14.0 AS base
WORKDIR /app
COPY package*.json ./

# -------- Development stage --------
FROM base AS dev
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:dev"]

# -------- Production build --------
FROM base AS builder
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM base AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
