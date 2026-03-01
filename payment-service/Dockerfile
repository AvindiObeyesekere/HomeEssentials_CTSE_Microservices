FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
