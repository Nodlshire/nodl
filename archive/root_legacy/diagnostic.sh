#!/bin/bash
echo "--- 1. CLEAN INBOX ---"
python3 /home/obregan/Documents/nodl/imap_fetch.py clean
rm -f cookies.txt

echo "--- 2. GET LOGIN ---"
curl -I -c cookies.txt -b cookies.txt -A "Mozilla/5.0" https://dr.wnode.one/login

echo "--- 3. GET CSRF ---"
curl -s -c cookies.txt -b cookies.txt -A "Mozilla/5.0" https://dr.wnode.one/api/auth/csrf > csrf.json
TOKEN=$(cat csrf.json | grep -oP '"csrfToken":"\K[^"]+')
echo "Token: $TOKEN"

echo "--- 4. POST SIGNIN ---"
curl -i -c cookies.txt -b cookies.txt -A "Mozilla/5.0" -X POST -d "email=dataroom@wnode.one" -d "csrfToken=$TOKEN" https://dr.wnode.one/api/auth/signin/email

echo "--- 5. FETCH LINK ---"
sleep 5
MAGIC_LINK=$(python3 /home/obregan/Documents/nodl/imap_fetch.py | tail -n 1)
echo "MAGIC_LINK=$MAGIC_LINK"

echo "--- 6. SIMULATE BROWSER CLICK ---"
curl -v -i -L -c cookies.txt -b cookies.txt -A "Mozilla/5.0" "$MAGIC_LINK" > callback_output.txt 2> curl_stderr.txt

echo "--- FINAL URL ---"
grep "< location:" curl_stderr.txt

echo "--- SET-COOKIE HEADERS ---"
grep "< set-cookie:" curl_stderr.txt

echo "--- COOKIES.TXT ---"
cat cookies.txt

echo "--- PM2 LOGS ---"
ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 'pm2 logs papermark --lines 120 --nostream | grep -iE "next-auth|session|callback|token|error"'
