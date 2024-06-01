# Stage-1 & specify a name 'builder'
FROM  node:latest AS builder


# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install dependencies (adjust if you use yarn)
RUN npm install

COPY . .  


# Build the production version of the app (adjust if you use yarn)
RUN npm run build

# Stage-2
#FROM nginx:1.25.2-alpine-slim
FROM nginx:alpine

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


 #Expose port 3000 (or the port your app listens on)
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]



