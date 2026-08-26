#!/usr/bin/env python3
"""
IndexNow & Search Engine Submission Script for Wnode & Nodlr
Notifies Bing, Yandex, Seznam, and Naver of all canonical URLs.
"""
import urllib.request
import json
import sys

INDEXNOW_KEY = "e5b32f91a0214c7798721c0b3952f41d"

WNODE_URLS = [
    "https://wnode.one/",
    "https://wnode.one/about/dewi",
    "https://wnode.one/affiliate-engine",
    "https://wnode.one/docs",
    "https://wnode.one/docs/architecture",
    "https://wnode.one/docs/security",
    "https://wnode.one/docs/developer-api",
    "https://wnode.one/docs/operations-runbooks",
    "https://wnode.one/docs/operator-hardware",
    "https://wnode.one/docs/economics-settlement",
    "https://wnode.one/docs/reference/glossary",
    "https://wnode.one/docs/reference/architecture",
    "https://wnode.one/docs/testing"
]

NODLR_URLS = [
    "https://nodlr.wnode.one/",
    "https://nodlr.wnode.one/signup",
    "https://nodlr.wnode.one/login",
    "https://nodlr.wnode.one/vge-explainer.html"
]

def submit_indexnow(host, url_list):
    endpoint = "https://api.indexnow.org/indexnow"
    payload = {
        "host": host,
        "key": INDEXNOW_KEY,
        "keyLocation": f"https://{host}/{INDEXNOW_KEY}.txt",
        "urlList": url_list
    }
    
    headers = {"Content-Type": "application/json; charset=utf-8"}
    data = json.dumps(payload).encode("utf-8")
    
    req = urllib.request.Request(endpoint, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"[IndexNow] Submitted {len(url_list)} URLs for {host} — Status: {resp.status}")
    except Exception as e:
        print(f"[IndexNow] Error submitting for {host}: {e}")

if __name__ == "__main__":
    print("=== Submitting Wnode & Nodlr URLs to IndexNow Search Engine Gateway ===")
    submit_indexnow("wnode.one", WNODE_URLS)
    submit_indexnow("nodlr.wnode.one", NODLR_URLS)
    print("=== Search Engine IndexNow Submission Complete! ===")
