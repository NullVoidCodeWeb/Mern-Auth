FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# # Build the Docker image
# docker build -t server-app .

# # Run the Docker container
# docker run -p 5000:5000 server-app
