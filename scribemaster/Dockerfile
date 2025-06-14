# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Step 2: Serve with NGINX
FROM nginx:stable-alpine

# Clear default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build to nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
