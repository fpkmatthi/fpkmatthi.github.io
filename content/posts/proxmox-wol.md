+++
title = "Proxmox Wake-On-LAN - alx driver patch"
date = "2020-01-28"
author = "Matthias Van De Velde"
cover = "img/proxmox.jpg"
tags = ["Proxmox", "alx", "WOL"]
keywords = ["", ""]
description = " "
showFullContent = false
draft = true
+++

At home, I use my old computer as a Proxmox server. To start my server from another computer in the same LAN or from a different LAN, I use Wake-on-LAN. Unfortunately, the alx driver is disabled by default since it breaks for some kernels. The bugtrack can be found [here](https://bugzilla.kernel.org/show_bug.cgi?id=61651)

1. Download the patch

```Bash
wget -O patch.tar.gz https://bugzilla.kernel.org/attachment.cgi?id=284877
```

2. Extract the archive

```Bash
mkdir ./patch
tar xvzf patch.tar.gz -C ./patch
```

3. Add the PVE No-Subscription repo to the apt sources and install the current kernel headers

```Bash
echo "deb http://download.proxmox.com/debian/pve buster pve-no-subscription" >> /etc/apt/sources.list
apt-get update
# the headers are specific to your kernel version!!
apt-get install git sudo ethtool pve-headers-5.3.10-1-pve
```

**NOTE:** If you get an error about "Failed to fetch" because of security issues, comment the line in `/etc/apt/sources.list.d/pve-enterprise.list` and retry.

4. Execute the setup script

```Bash
./patch/qlx-dkms-installer/setup
```

5. Create a script to fix interfaces and reload the alx kernel module

```Bash
#!/usr/bin/env bash

modprobe -r alx && modprobe alx

ip link set enp6s0 down
systemctl restart networking.service
ip link set enp6s0 up
```

6. Copy script to /usr/bin and make it executable

```Bash
sudo cp test_service.sh /usr/bin/test_service.sh
sudo chmod +x /usr/bin/test_service.sh
```

7. Create systemd service file to run the script at startup

```Systemd
[Unit]
Description=fix the interface for WOL

[Service]
Type=simple
ExecStart=/bin/bash /usr/bin/fix-int.sh

[Install]
WantedBy=multi-user.target
```

```Bash
sudo cp /lib/systemd/system/fix-int.service /etc/systemd/system/fix-int.service
sudo chmod 644 /etc/systemd/system/fix-int.service
systemctl start fix-int.service
systemctl enable fix-int.service
```

8. Enable WOL on the connected interface

```Bash
ethtool -s enp6s0 wol g
```

9. From another device, wake the server (ref. [Arch Wiki](https://wiki.archlinux.org/index.php/Wake-on-LAN#Trigger_a_wake_up))

```Bash
sudo pacman -S wol
wol <target_mac_address>
```

## References:

* https://wiki.archlinux.org/index.php/Wake-on-LAN
* https://www.beachyuk.com/blog/get-wake-on-lan-working-on-linux-with-atheros-network-adaptor
* https://www.linode.com/docs/quick-answers/linux/start-service-at-boot/
* https://bugzilla.kernel.org/show_bug.cgi?id=61651
* [patch](https://bugzilla.kernel.org/attachment.cgi?id=284877)
