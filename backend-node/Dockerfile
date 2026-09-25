FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "dist/server.js"]
