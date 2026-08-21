#!/bin/bash
cd /home/obregan/Documents/nodl
rm -f cookies.txt csrf.json callback_output.txt curl_stderr.txt

echo "--- 1. CLEAN INBOX ---"
python3 /home/obregan/Documents/nodl/imap_fetch.py clean

echo "--- 2. GET CSRF ---"
curl -s -c cookies.txt -b cookies.txt -A "Mozilla/5.0" https://dr.wnode.one/api/auth/csrf > csrf.json
TOKEN=$(grep -oP '"csrfToken":"\K[^"]+' csrf.json)
echo "CSRF_TOKEN=$TOKEN"

curl -i -c cookies.txt -b cookies.txt -A "Mozilla/5.0" \
  -X POST \
  -d "email=dataroom@wnode.one" \
  -d "csrfToken=$TOKEN" \
  https://dr.wnode.one/api/auth/signin/email

echo "--- 3. DB BEFORE ---"
ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 \
  'psql postgresql://postgres:papermark123@localhost:5432/papermark -c "SELECT * FROM \"VerificationToken\" ORDER BY \"expires\" DESC LIMIT 5;"'

echo "--- 4. FETCH MAGIC LINK ---"
sleep 5
export MAGIC_LINK=$(python3 /home/obregan/Documents/nodl/imap_fetch.py | tail -n 1)
echo "MAGIC_LINK=$MAGIC_LINK"

echo "--- 5. PARSE ---"
eval $(python3 - << 'EOF'
import urllib.parse, os
link = os.environ["MAGIC_LINK"]
parsed = urllib.parse.urlparse(link)
qs = urllib.parse.parse_qs(parsed.query)
print("TOKEN_VALUE='" + urllib.parse.quote(qs.get("token", [""])[0]) + "'")
print("EMAIL_VALUE='" + urllib.parse.quote(qs.get("email", [""])[0]) + "'")
print("CALLBACK_VALUE='" + urllib.parse.quote(qs.get("callbackUrl", [""])[0]) + "'")
EOF
)

echo "TOKEN=$TOKEN_VALUE"
echo "EMAIL=$EMAIL_VALUE"
echo "CALLBACK=$CALLBACK_VALUE"

echo "--- 6a. LOAD VERIFY PAGE ---"
curl -s -i -c cookies.txt -b cookies.txt -A "Mozilla/5.0" "$MAGIC_LINK" > verify_page.html

echo "--- 6b. CALLBACK ---"
QUERY="token=$TOKEN_VALUE&email=$EMAIL_VALUE&callbackUrl=$CALLBACK_VALUE"

curl -s -v -i -L -c cookies.txt -b cookies.txt -A "Mozilla/5.0" \
  "https://dr.wnode.one/api/auth/callback/email?$QUERY" \
  > callback_output.txt 2> curl_stderr.txt

echo "--- CURL REDIRECT CHAIN ---"
cat curl_stderr.txt | grep -i "< location:" || echo "No Location headers found"

echo "--- FINAL RESPONSE STATUS LINE ---"
head -n 1 callback_output.txt

echo "--- FINAL URL (if any) ---"
grep -i "^location:" callback_output.txt || echo "No Location header in final response"

echo "--- 8. DB AFTER ---"
ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 \
  'psql postgresql://postgres:papermark123@localhost:5432/papermark -c "SELECT * FROM \"VerificationToken\" ORDER BY \"expires\" DESC LIMIT 5;"'

ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 \
  'psql postgresql://postgres:papermark123@localhost:5432/papermark -c "SELECT * FROM \"Session\" ORDER BY \"expires\" DESC LIMIT 5;"'

echo "--- 9. LOGS ---"
ssh -i /home/obregan/.ssh/id_ed25519_staffa -o StrictHostKeyChecking=no obregan@192.168.1.140 \
  'pm2 logs papermark --lines 120 --nostream | grep -iE "next-auth|email|callback|session|verification|error" || true'
