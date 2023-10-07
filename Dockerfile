FROM node:18.12.1-alpine

COPY . .

RUN npm ci

CMD ["npm", "start"]