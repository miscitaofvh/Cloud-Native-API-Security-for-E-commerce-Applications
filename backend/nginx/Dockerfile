FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY ssl/ecdsa_cert.pem /etc/nginx/ssl/ecdsa_cert.pem
COPY ssl/ecdsa_private_key.pem /etc/nginx/ssl/ecdsa_private_key.pem

EXPOSE 443 80
