FROM nginx:alpine

LABEL org.opencontainers.image.source=https://github.com/pentops/o5-ui

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

ADD ./ext/nginx.conf /etc/nginx/conf.d/default.conf

ADD ./dist ./

ENTRYPOINT ["nginx", "-g", "daemon off;"]
