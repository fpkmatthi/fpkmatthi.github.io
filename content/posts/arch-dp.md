+++
title = "Arch DisplayLink"
date = "2023-09-06"
author = "Matthias Van De Velde"
cover = "img/displaylink-logo.webp"
tags = ["Arch", "DisplayLink"]
keywords = ["Arch", "DisplayLink"]
description = "A short reminder for myself on how to configure DisplayLink on Arch"
showFullContent = false
draft = false
+++

I am using a Lenovo USB-C / USB-A docking station and it has DisplayPorts, which means it loads DisplayLink when connecting to Linux.


Follow the Arch wiki to install the right packages (section 1.2)

https://wiki.archlinux.org/title/DisplayLink

When you have to create the following file:
 
```yml
/etc/X11/xorg.conf.d/20-evdi.conf

Section "OutputClass"
    Identifier "DisplayLink"
    MatchDriver "evdi"
    Driver "modesetting"
    Option "AccelMethod" "none"
EndSection
```

Don't name it "20-evdi.conf" but "evdidevice.conf". For some reason this works `¯\_(ツ)_/¯`

NOTE: The Arch wiki says: Both the HDMI port and DisplayPort outputs created when using either a USB-C adapter or Thunderbolt dock are wired to the Nvidia dGPU. ([link](https://wiki.archlinux.org/title/Lenovo_ThinkPad_X1_Extreme#:~:text=Both%20the%20HDMI%20port%20and%20DisplayPort%20outputs%20created%20when%20using%20either%20a%20USB%2DC%20adapter%20or%20Thunderbolt%20dock%20are%20wired%20to%20the%20Nvidia%20dGPU.))
