FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk update && apk add yarn \
    python g++ make \
    && rm -rf /var/cache/apk/*


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Build project
RUN npm run build

# Migrate Database
RUN npm run migrate



EXPOSE 3000
CMD ["npm", "start"]