FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY start.sh /app/start.sh

RUN chmod +x /app/start.sh

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT [ "/app/start.sh" ]

#CMD ["serve", "-s", "dist"]