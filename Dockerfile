FROM node:14

# Install MySQL
RUN apt-get update && apt-get install -y default-mysql-server

# Set up server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
RUN npm run build

# Set up client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Copy start script
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Install serve globally
RUN npm install -g serve

# Expose ports
EXPOSE 3000 5000

# Start services
CMD ["/bin/bash", "./start.sh"]