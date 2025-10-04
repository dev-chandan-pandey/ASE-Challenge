# Frontend (React + Vite)
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use lightweight web server for static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx config to handle SPA fallback
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
