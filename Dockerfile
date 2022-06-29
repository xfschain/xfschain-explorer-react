FROM node:17-alpine as builder
WORKDIR /var/cache/nodejs
COPY package.json .
RUN ["npm", "install"]
COPY . .
ARG REACT_APP_API_BASE_URL=
RUN echo ${REACT_APP_API_BASE_URL}
RUN ["npm", "run", "build"]

FROM nginx:1.21.5-alpine

COPY nginx-default-server.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /var/cache/nodejs/build .

CMD ["nginx","-g","daemon off;"]
