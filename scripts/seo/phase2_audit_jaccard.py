#!/usr/bin/env python3
import os
import re
import urllib.request

HUB_ROUTES = [
    ("docs_index", "http://127.0.0.1:3000/docs"),
    ("architecture", "http://127.0.0.1:3000/docs/architecture"),
    ("security", "http://127.0.0.1:3000/docs/security"),
    ("operator", "http://127.0.0.1:3000/docs/operator"),
    ("developer", "http://127.0.0.1:3000/docs/developer"),
    ("economics", "http://127.0.0.1:3000/docs/economics"),
    ("execution", "http://127.0.0.1:3000/docs/execution"),
    ("overview", "http://127.0.0.1:3000/docs/overview"),
]

def extract_body_words(html: str) -> list[str]:
    # Extract text content between <body> tags or main container
    text = re.sub(r'<script.*?>.*?</script>', '', html, flags=re.DOTALL)
    text = re.sub(r'<style.*?>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<svg.*?>.*?</svg>', '', text, flags=re.DOTALL)
    text = re.sub(r'<.*?>', ' ', text)
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    return words

def jaccard_similarity(words1: list[str], words2: list[str]) -> float:
    set1, set2 = set(words1), set(words2)
    if not set1 or not set2:
        return 0.0
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0.0

def main():
    print("=" * 60)
    print("PHASE 2 — HUB PAGES CONTENT DEPTH & UNIQUENESS AUDIT")
    print("=" * 60)
    
    route_words = {}
    thin_pages = []
    
    for name, url in HUB_ROUTES:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Phase2Audit/1.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8')
                words = extract_body_words(html)
                route_words[name] = words
                word_count = len(words)
                print(f"[{name}] Word count: {word_count}")
                if word_count < 800:
                    thin_pages.append((name, word_count))
        except Exception as e:
            print(f"❌ Failed to fetch {url}: {e}")
            route_words[name] = []
            thin_pages.append((name, 0))
            
    print("\n-----------------------------------------------------------")
    print("JACCARD SIMILARITY MATRIX BETWEEN HUB PAIRS")
    print("-----------------------------------------------------------")
    
    high_similarity_pairs = []
    names = list(route_words.keys())
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            n1, n2 = names[i], names[j]
            sim = jaccard_similarity(route_words[n1], route_words[n2])
            print(f"  {n1} vs {n2} -> Jaccard: {sim:.4f}")
            if sim >= 0.85:
                high_similarity_pairs.append((n1, n2, sim))
                
    print("\n-----------------------------------------------------------")
    print(f"Thin Hub Pages (<800 words): {len(thin_pages)}")
    print(f"Jaccard ≥ 0.85 Violations: {len(high_similarity_pairs)}")
    print("-----------------------------------------------------------")
    
    if not thin_pages and not high_similarity_pairs:
        print("✅ PASS: All hub pages have ≥800 words and Jaccard < 0.85")
    else:
        print("❌ FAIL: Phase 2 criteria not met.")

if __name__ == "__main__":
    main()
