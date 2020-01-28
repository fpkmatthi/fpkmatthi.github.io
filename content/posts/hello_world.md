+++
title = "Setting up my website enviroment"
date = "2020-01-20"
author = "Matthias Van De Velde"
cover = "img/digi_world.jpg"
tags = ["firsttime", "setup"]
keywords = ["Hugo", "Github Pages", "Travis CI", "Docker"]
description = "This write-up is about how I set up my repo, travis ci and docker container to work on my portfolio."
showFullContent = false
draft = false
+++

This write-up is about how I set up my repo, travis ci and docker container to work on my portfolio.

## Content

* [Kick-off](#kick-off)
* [Docker](#docker)
* [Hugo](#hugo)
* [Linking Github Pages](#link-github-pages)
* [Conclusion](#conclusion)

## Kick-off

Create and open a new project folder

```Bash
mkdir -p ~/portfolio
cd ~/portfolio
```

## Docker

### Install docker (refer to the [Arch Wiki](https://wiki.archlinux.org/index.php/Docker#Installation) ¯\\_(ツ)_/¯ )

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

I use docker to host Hugo and create a website in the shared directory.
The generated code inside the new directory is then used to build the website.
To host our website on Github Pages, I'll need the build files to be on the `master` branch,
so I'll create en new branch that will contain the code. The website will be generated into `public` so 
I'll add to to our gitignore since I don't want this on the `code` branch.

Here I'm adding a theme but this is optional.

You can now commit and push the `code` branch to the remote repo.

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

The `master` branch will contain **only** the build files.

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

To serve the site locally, I'll use Docker.

```Bash
docker run --rm \
    -it \
    -v $PWD:/src \
    -p 1313:1313 \
    -u hugo hugo_portfolio hugo server \
    -w \
    --bind=0.0.0.0
```

### Linking Github Pages

Create a personal access token for Travis CI on github.
Check the boxes for `public_repo`, `repo:status`, `repo_deployment`.

![github settings](/img/github.png)

Set the environment vars for the repo in Travis CI:

| var             | value                                    |
| :---            | ---:                                     |
| GITHUB_USERNAME | fpkmatthi                                |
| GITHUB_TOKEN    | abcdefghijklmnopqrstuvwxyz0123456789abcd |
| GITHUB_EMAIL    | fpkmatthi@fpkmatthi.me                   |

![travis repo settings](/img/travis.png)

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

Travis should now be triggered. After a while the site will be built.

![build status](/img/build.png)

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

## Problems I encountered

1. The page has no CSS when visiting it on github. When you open the developer console, there are a few errors like "Blocked loading mixed active content"

* Make sure the `baseurl` in the site config **config.toml** uses https (e.g. https://fpkmatthi.xyz/) if Github Pages is configured to use HTTPS as well.

## References

* https://axdlog.com/2018/using-hugo-and-travis-ci-to-deploy-blog-to-github-pages-automatically/
* https://github.com/panr/hugo-theme-terminal
