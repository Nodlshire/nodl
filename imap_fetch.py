import imaplib
import email
import re
import time
import sys
from email.header import decode_header

username = "dataroom@wnode.one"
password = "Slartibartfast123"
imap_url = "premium212-2.web-hosting.com"

def get_magic_link():
    try:
        mail = imaplib.IMAP4_SSL(imap_url)
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, "ALL")
        if status != "OK" or not messages[0]:
            return None
            
        latest_email_id = messages[0].split()[-1]
        status, msg_data = mail.fetch(latest_email_id, "(RFC822)")
        
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                
                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        
                        if content_type == "text/plain" or content_type == "text/html":
                            body += part.get_payload(decode=True).decode(errors='ignore')
                else:
                    body = msg.get_payload(decode=True).decode(errors='ignore')
                
                # Extract the link
                urls = re.findall(r'https?://[^\s<>"\']+', body)
                for url in urls:
                    if '/verify' in url or 'api/auth/callback/email' in url:
                        return url
    except Exception as e:
        print(f"Error: {e}")
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "clean":
        mail = imaplib.IMAP4_SSL(imap_url)
        mail.login(username, password)
        mail.select("inbox")
        mail.store("1:*", "+FLAGS", "\\Deleted")
        mail.expunge()
        print("Inbox cleaned.")
        sys.exit(0)
        
    print("Waiting for email...")
    for _ in range(15):
        link = get_magic_link()
        if link:
            print(link)
            sys.exit(0)
        time.sleep(2)
    print("No email found.")
    sys.exit(1)
