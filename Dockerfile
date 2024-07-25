# Stage 1
FROM node:18.17.1 AS s1
WORKDIR /proco
COPY package.json ./
RUN yarn install
COPY . .

ARG RECAPTCHA_KEY
ENV RECAPTCHA_KEY=$RECAPTCHA_KEY
ARG API_MAPBOX_ACCESS_TOKEN
ENV API_MAPBOX_ACCESS_TOKEN=$API_MAPBOX_ACCESS_TOKEN
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ARG B2C_CLIENT_ID
ENV B2C_CLIENT_ID=$B2C_CLIENT_ID
ARG ENV
ENV ENV=$ENV
ARG MATOMO_SITE_ID
ENV MATOMO_SITE_ID=$MATOMO_SITE_ID

RUN echo $RECAPTCHA_KEY \
        && echo $API_MAPBOX_ACCESS_TOKEN \
        && echo $API_BASE_URL \
        && echo $B2C_CLIENT_ID

RUN yarn build

# Stage 2
FROM nginx:1.24 AS s2

# ssh
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
	&& apt-get install -y --no-install-recommends openssh-server \
	&& echo "$SSH_PASSWD" | chpasswd

COPY sshd_config /etc/ssh/

# add built frontend
RUN rm -rf /usr/share/nginx/html/*
COPY --from=s1 /proco/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ngx.conf /etc/nginx/nginx.conf

# Add Prometheus Exporter for nginx
RUN curl -L https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v1.2.0/nginx-prometheus-exporter_1.2.0_linux_amd64.tar.gz -o nginx-exporter.tar.gz \
      && tar -zxf nginx-exporter.tar.gz \
      && ./nginx-prometheus-exporter --version 

CMD ["./nginx-prometheus-exporter", "--nginx.scrape-uri=http://127.0.0.1/nginx_status"]
CMD ["service", "nginx start"]

EXPOSE 80 2222
