service nginx start
./nginx-prometheus-exporter --nginx.scrape-uri=http://127.0.0.1/nginx_status
