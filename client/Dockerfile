FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# # Build the Docker image
# docker build -t client-app .

# # Run the Docker container
# docker run -p 3000:3000 client-app

 