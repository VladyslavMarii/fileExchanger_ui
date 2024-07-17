# Use a Node.js runtime as the base image with a compatible version
FROM node:18.19.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the Angular CLI globally
RUN npm install -g @angular/cli@latest

# Install the project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular application
RUN ng build --configuration production

# Use an official Nginx runtime as the base image
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the Nginx HTML directory
COPY --from=build /app/dist/file_saver_web /usr/share/nginx/html

# Expose port 3000
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
