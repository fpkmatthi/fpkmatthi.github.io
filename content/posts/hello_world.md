+++
title = "Setting up my website enviroment"
date = "2020-01-20"
author = "Matthias Van De Velde"
cover = "img/digi_world.jpg"
tags = ["firsttime", ""]
keywords = ["", ""]
description = "This write-up is about how I set up my repo, travis ci and docker container to work on my portfolio."
showFullContent = false
+++

# Portfolio

This write-up is about how I set up my repo, travis ci and docker container to work on my portfolio.

ref: https://inside.getambassador.com/creating-and-deploying-your-first-hugo-site-to-github-pages-1e1f496cf88d

## Content

* Kick-off
* Docker
* Hugo
* Github Pages
* Conclusion

## Kick-off

Create and open a new project folder

```Bash
mkdir -p ~/portfolio
cd ~/portfolio
```

## Docker

### Install docker (refer to the [Arch Wiki]())

```Bash
sudo pacman -S docker
```

### Creating docker image

Alpine Linux is used as the base image

```Dockerfile
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
```

```Bash
docker build -t hugo_portfolio .
```

## Hugo

### Creating a new site

Create a new site with hugo.
init the website directory as a new git repo
create a branch for the code
add a theme
commit
push

The `code` branch contains the code to generate the website.

```Bash
docker run --rm -it -v $PWD:/src -u hugo hugo_portfolio hugo new site fpkmatthi.github.io
cd fpkmatthi.github.io

git init

git checkout -b code

echo '/public/' >> .gitignore
sed -r -i '/^\/public\/$/{$!d}' .gitignore

git add .
git commit -m "Initial commit"

# git submodule add <link> themes/<theme_name>
git submodule add https://github.com/panr/hugo-theme-terminal.git themes/terminal

git add .

git commit -m "Add theme submodule"

git remote add origin git@github.com:fpkmatthi/portfoli-hug-o.git
git push -u origin code
```

The `master` branch contains the build files.

```Bash
docker run --rm \
    -it \
    -v $PWD:/src \
    -u hugo \
    hugo_portfolio hugo

HUGO_TEMP_DIR=$(mktemp -d)
cp -R public/* "$HUGO_TEMP_DIR"

git checkout --orphan master

rm .git/index
git clean -fdx

cp -R "$HUGO_TEMP_DIR"/. .

git add .

git commit -m 'initial blog content'
git push -u origin master

[[ -d "$HUGO_TEMP_DIR" ]] && rm -rf "$HUGO_TEMP_DIR"
```

Build and serve the site locally.

```Bash
docker run --rm \
    -it \
    -v $PWD:/src \
    -p 1313:1313 \
    -u hugo hugo_portfolio hugo server \
    -w \
    --bind=0.0.0.0
```

### Linking github.io

Create a personal access token for Travis CI, check the boxes for `public_repo`, `repo:status`, `repo_deployment`.

Set the environment vars for:

| var | value |
| --- | --- |
|GITHUB_USERNAME|fpkmatthi|
|GITHUB_TOKEN|75e8b7y318ebf48df0bc35cp4affd79e167b2489|
|GITHUB_EMAIL|fpkmatthi@fpkmatthi.me|

Activate the repo

Push .travis.yml to the code branch.

```Bash
git checkout code
```

```Yaml
dist: xenial
language: python
python:
  - "3.7"

before_install:
  - sudo apt-get update -qq
  - sudo apt-get -yq install apt-transport-https tor curl

# install - install any dependencies required
install:
    # Github may forbid request from travis container, so use tor proxy
    - sudo systemctl start tor
    - download_command='curl -fsSL -x socks5h://127.0.0.1:9050' # --socks5-hostname
    - $download_command -O $($download_command https://api.github.com/repos/gohugoio/hugo/releases/latest | sed -r -n '/browser_download_url/{/Linux-64bit.deb/{s@[^:]*:[[:space:]]*"([^"]*)".*@\1@g;p;q}}')
    - sudo dpkg -i hugo*.deb
    - rm -rf public 2> /dev/null

# script - run the build script
script:
    - hugo
    - echo "fpkmatthi.xyz" > public/CNAME

deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN  # Set in travis-ci.org dashboard, marked secure
  email: $GITHUB_EMAIL
  name: $GITHUB_USERNAME
  verbose: true
  keep-history: true
  local-dir: public
  target_branch: master  # branch contains blog content
  on:
    branch: code  # branch contains Hugo generator code
```

```Bash
git add .
git commit -m "Add travis.yml"
git push
```

Add a post

```Bash
docker run --rm -it -v $PWD:/src -u hugo hugo_portfolio hugo new posts/hello_world.md
```

### Some Jedi mind tricks

Create an alias in your shell config file (e.g. .bashrc).

```Bash
alias hugo-build='docker run --rm -it -v $PWD:/src -u hugo hugo_portfolio hugo'
alias hugo-server='docker run --rm -it -v $PWD:/src -p 1313:1313 -u hugo hugo_portfolio hugo server --bind 0.0.0.0'
```

## Using Continuous Integration to ease your pain

Travis CI is now triggerd to build your site when you push something on the `code` branch. These build files are then pushed to the master branch of the same repo.


https://medium.com/swlh/hosting-a-hugo-blog-on-github-pages-with-travis-ci-e74a1d686f10

https://github.com/fpkmatthi/fpkmatthi.github.io

https://github.com/fpkmatthi/portfoli-hug-o

https://github.com/panr/hugo-theme-terminal
