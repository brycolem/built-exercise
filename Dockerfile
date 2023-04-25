FROM nginx:1.21-alpine

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

RUN rm /etc/nginx/conf.d/default.conf

COPY dist/built-exercise /usr/share/nginx/html
