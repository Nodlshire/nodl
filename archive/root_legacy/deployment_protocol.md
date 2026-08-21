# WNode Fixed System Specifications & Deployment Protocol

## 1. Environment Configurations
* **Local Dev Directory:** `/home/obregan/Documents/nodl`
* **Live Server Directory:** `/home/obregan/wnode`
* **SSH Target:** `obregan@192.168.1.140` (Passwordless, key-based auth)

## 2. Process & Port Mapping
All PM2 processes must match this configuration exactly inside ecosystem.config.js:
* **web** (Port `3004`) -> `apps/web`
* **command** (Port `3001`) -> `apps/command`
* **nodlr** (Port `3002`) -> `apps/nodlr`
* **mesh** (Port `3003`) -> `apps/mesh`
* **backend** (Port `8080`) -> `nodld` (binary: `/home/obregan/wnode/nodld_bin`)

Never attempt to swap these ports or use different paths.
