FROM ubuntu:latest

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y screen rsync curl git

# install Node.js
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs build-essential

# install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# install Docker
RUN curl -fsSL get.docker.com -o get-docker.sh
RUN sh get-docker.sh
