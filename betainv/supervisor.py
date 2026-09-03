#!/usr/bin/env python3
import os
import sys
import time
import json
import logging
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGS_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(LOGS_DIR, "supervisor.log")),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("supervisor")

MODULES = [
    {
        "name": "dashboard",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "apps", "dashboard.py")],
        "log": os.path.join(LOGS_DIR, "dashboard.log")
    },
    {
        "name": "docs_bot",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "apps", "docs_bot.py")],
        "log": os.path.join(LOGS_DIR, "docs_bot.log")
    },
    {
        "name": "discord_bot",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "apps", "discord_bot.py")],
        "log": os.path.join(LOGS_DIR, "discord_bot.log")
    },
    {
        "name": "dork_scraper",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "scripts", "dork_scraper.py")],
        "log": os.path.join(LOGS_DIR, "dork_scraper.log")
    },
    {
        "name": "mailer",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "scripts", "lead_scraper_mailer.py")],
        "log": os.path.join(LOGS_DIR, "mailer.log")
    },
    {
        "name": "telemetry",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "scripts", "telemetry_worker.py")],
        "log": os.path.join(LOGS_DIR, "telemetry_worker.log")
    },
    {
        "name": "airdrop_exporter",
        "cmd": [sys.executable, os.path.join(BASE_DIR, "scripts", "airdrop_exporter.py"), "--loop"],
        "log": os.path.join(LOGS_DIR, "airdrop_exporter.log")
    }
]

processes = {}

def start_module(mod):
    name = mod["name"]
    cmd = mod["cmd"]
    log_path = mod["log"]
    
    log_file = open(log_path, "a")
    proc = subprocess.Popen(
        cmd,
        cwd=BASE_DIR,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    processes[name] = {
        "proc": proc,
        "mod": mod,
        "log_file": log_file,
        "started_at": time.time()
    }
    logger.info(f"Spawned worker '{name}' (PID: {proc.pid}) -> Log: {log_path}")
    update_pid_tracking()

def update_pid_tracking():
    pid_file = os.path.join(BASE_DIR, ".pids")
    pid_data = {
        "supervisor_pid": os.getpid(),
        "workers": {name: data["proc"].pid for name, data in processes.items() if data["proc"].poll() is None}
    }
    with open(pid_file, "w") as f:
        json.dump(pid_data, f, indent=2)

def monitor_loop():
    logger.info("========================================================")
    logger.info(" Starting wnode Auto-Restart Process Supervisor (6 Daemons)")
    logger.info(f" Base Directory: {BASE_DIR}")
    logger.info(" Assigned Ports: Dashboard (3010), Docs Bot (8088)")
    logger.info(" Protected Core Port: 8000 (Untouched)")
    logger.info("========================================================")

    # Initial launch
    for mod in MODULES:
        start_module(mod)

    while True:
        try:
            time.sleep(5)
            for mod in MODULES:
                name = mod["name"]
                info = processes.get(name)
                if not info or info["proc"].poll() is not None:
                    exit_code = info["proc"].poll() if info else "Unknown"
                    logger.warning(f"Worker '{name}' terminated unexpectedly (Exit Code: {exit_code}). Restarting immediately...")
                    if info and info.get("log_file"):
                        try:
                            info["log_file"].close()
                        except Exception:
                            pass
                    start_module(mod)
            update_pid_tracking()
        except KeyboardInterrupt:
            logger.info("Received shutdown signal. Terminating all managed workers...")
            for name, data in processes.items():
                if data["proc"].poll() is None:
                    data["proc"].terminate()
            sys.exit(0)
        except Exception as e:
            logger.error(f"Error in supervisor loop: {e}")

if __name__ == "__main__":
    monitor_loop()
