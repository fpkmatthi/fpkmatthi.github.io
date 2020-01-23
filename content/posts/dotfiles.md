+++
title = "My ~/dotfile setup"
date = "2020-01-23"
author = "Matthias Van De Velde"
cover = "img/desktop.png"
tags = ["dotfiles", "bspwm", "sxhkd", "vim", "tmux", ""]
keywords = ["", ""]
description = "How to backup and restore your dotfiles"
showFullContent = false
draft = false
+++

This method involves using a Bare Git repo. You can find the dotfiles for my daily driver [here](https://github.com/fpkmatthi/dotfiles-ideapad)

## Content

* [Starting a new repo](#starting-a-new-repo)
* [Deploying dotfiles on a new system](#deploying-dotfiles-on-a-new-system)
* [Final script](#final-script)


## Starting a new repo

Create a bare repo and an alias for git to work in that repo.
Hide untracked files in `config status`.
Put the alias in your shell config (e.g. bashrc).
This way, you can use the alias when you open a new shell.

```Bash
git init --bare $HOME/.cfg
alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'
config config --local status.showUntrackedFiles no
echo "alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'" >> $HOME/.bashrc
```

An example on how to use it:

```Bash
config status
config add .vimrc
config commit -m "Add vimrc"

config remote add https://github.com/fpkmatthi/dotfiles-ideapad.git
config push -u origin
```

## Deploying dotfiles on a new system

Configure the alias, let the source repo ignore the folder where it will be cloned and then clone the repo.
```Bash
echo "alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'" >> $HOME/.bashrc
echo ".cfg" >> .gitignore
git clone --bare <git-repo-url> $HOME/.cfg
alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'
```

Checkout the actual content from the repo.

```Bash
config checkout
```

If you receiver an error like this: 

```
error: The following untracked working tree files would be overwritten by checkout:
    .bashrc
    .gitignore
Please move or remove them before you can switch branches.
Aborting
```

Backup the files that cause an error and checkout again.

```Bash
mkdir -p .config-backup && \
config checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | \
xargs -I{} mv {} .config-backup/{}

config checkout
```

Hide untracked files in `config status`.

```Bash
config config --local status.showUntrackedFiles no
```

## Final script

```Bash
git clone --bare https://github.com/fpkmatthi/dotfiles-ideapad.git $HOME/.cfg

function config() {
   /usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME $@
}

mkdir -p .config-backup

config checkout

if [ $? = 0 ]; then
  echo "Checked out config."
else
    echo "Backing up pre-existing dot files."
    config checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .config-backup/{}
fi

config checkout
config config status.showUntrackedFiles no
```

## Post deploy steps

1. Install the Hack font, located in ~/.config/hack

```Bash
cp -r ~/.config/hack /usr/share/fonts
fc-cache -f -v
```

## References

* https://www.atlassian.com/git/tutorials/dotfiles

