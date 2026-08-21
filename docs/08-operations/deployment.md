# Production Deployment Protocol

## Production Stack Architecture
* **Host**: `192.168.1.140` (`obregan@192.168.1.140`)
* **Process Manager**: PM2 (`pm2 status`, `pm2 restart web`, `pm2 restart backend`)
* **Reverse Proxy**: Caddy / Cloudflare SSL termination
* **Database**: BBolt DB (`/home/obregan/wnode/nodld/state/engine.db`)
* **Static Assets**: GitHub Releases `v1.0.3`

## Single-Command Deployment
```bash
git push origin main
ssh obregan@192.168.1.140 "cd /home/obregan/wnode && git pull && pm2 restart all"
```
