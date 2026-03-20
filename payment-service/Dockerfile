FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app
COPY . .

EXPOSE 3005

CMD ["npm", "start"]
