#!/bin/bash
scp -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no /home/obregan/Documents/nodl/verify_page.tsx obregan@192.168.1.140:/opt/papermark/app/\(auth\)/verify/page.tsx
ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 'cd /opt/papermark && pnpm build && pm2 restart papermark && pm2 flush papermark'

echo "--- 1. CLEAN INBOX ---"
python3 /home/obregan/Documents/nodl/imap_fetch.py clean
rm -f cookies.txt

echo "--- 2. GET CSRF ---"
curl -s -c cookies.txt -b cookies.txt -A "Mozilla/5.0" https://dr.wnode.one/api/auth/csrf > csrf.json
TOKEN=$(cat csrf.json | grep -oP '"csrfToken":"\K[^"]+')

echo "--- 3. POST SIGNIN ---"
curl -s -i -c cookies.txt -b cookies.txt -A "Mozilla/5.0" -X POST -d "email=dataroom@wnode.one" -d "csrfToken=$TOKEN" https://dr.wnode.one/api/auth/signin/email > /dev/null

echo "--- 4. FETCH LINK ---"
sleep 5
MAGIC_LINK=$(python3 /home/obregan/Documents/nodl/imap_fetch.py | tail -n 1)
echo "MAGIC_LINK=$MAGIC_LINK"
