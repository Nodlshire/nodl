# Node Operator Complete Guide

## Desktop GUI & System Tray
The standalone desktop app (`nodl-desktop`) launches a native app window without requiring a external browser. It runs seamlessly in the system tray, providing live uptime metrics, work score indicators, and bandwidth allocation sliders.

## Autostart Setup (Systemd)
```ini
[Unit]
Description=Wnode Core Daemon
After=network.target

[Service]
ExecStart=/usr/local/bin/nodl-core --token YOUR_DEVICE_TOKEN
Restart=always
RestartSec=5
User=obregan

[Install]
WantedBy=multi-user.target
```
