FROM alpine:latest

RUN apk add --no-cache \
    curl \
    git \
    openssh-client \
    rsync \
    bash \
    hugo

ENV VERSION=0.62.2

RUN addgroup -Sg 1000 hugo && adduser -SG hugo -u 1000 -h /src hugo

WORKDIR /src

EXPOSE 1313
