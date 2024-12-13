FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --production

COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]