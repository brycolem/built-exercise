FROM node:lts

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--proxy-config", "proxy.conf.json"]

WORKDIR /built

COPY . .

RUN npm install @angular/cli -g
