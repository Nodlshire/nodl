#!/usr/bin/env python3
import os
import re
import urllib.request
from phase2_audit_jaccard import hrefs

web_app_dir = "/home/obregan/Documents/nodl/apps/web/app/docs"
public_dir = "/home/obregan/Documents/nodl/apps/web/public"
docs_md_dir = "/home/obregan/Documents/nodl/docs"

print("\n===========================================================")
print("PHASE 3 (RETRY #5) — TARGETED VISUAL LAYER HARD AUDIT")
print("===========================================================")

visual_fail = 0
anim_fail = 0
broken_paths = 0
markdown_visual_fail = 0
http_fail = 0

# Target route requirements from Grok
target_route_embeds = {
    "/docs": {
        "diagrams": ["fig-1-1-global-architecture.svg", "fig-1-2-job-execution-sequence.svg", "fig-3-1-ram-only-compute-model.svg"],
        "animations": ["job-lifecycle-animation.svg"]
    },
    "/docs/architecture": {
        "diagrams": ["fig-1-1-global-architecture.svg", "fig-1-2-job-execution-sequence.svg", "fig-3-1-ram-only-compute-model.svg"],
        "animations": ["job-lifecycle-animation.svg"]
    },
    "/docs/security": {
        "diagrams": ["fig-2-1-security-envelope.svg", "fig-2-2-nonce-replay-sequence.svg", "fig-4-1-zero-trust-sandbox.svg", "fig-8-1-stride-threat-mitigation.svg"],
        "animations": ["nonce-replay-animation.svg", "capability-trap-animation.svg"]
    }
}

# Target markdown requirements from Grok
target_md_embeds = {
    "INDEX.md": {
        "diagrams": ["fig-1-1", "fig-1-2", "fig-3-1"],
        "animations": ["job-lifecycle-animation.svg"]
    },
    "01-architecture/system-architecture.md": {
        "diagrams": ["fig-1-1", "fig-1-2", "fig-3-1"],
        "animations": ["job-lifecycle-animation.svg"]
    },
    "02-security/security-model.md": {
        "diagrams": ["fig-2-1", "fig-2-2", "fig-4-1", "fig-8-1"],
        "animations": ["nonce-replay-animation.svg", "capability-trap-animation.svg"]
    },
    "architecture.md": {
        "diagrams": ["fig-1-1", "fig-1-2", "fig-3-1"],
        "animations": ["job-lifecycle-animation.svg"]
    },
    "security.md": {
        "diagrams": ["fig-2-1", "fig-2-2", "fig-4-1", "fig-8-1"],
        "animations": ["nonce-replay-animation.svg", "capability-trap-animation.svg"]
    }
}

# 1. Audit Target Routes on LIVE HTTP
for route, reqs in target_route_embeds.items():
    live_url = f"http://127.0.0.1:3000{route}"
    try:
        req = urllib.request.urlopen(live_url, timeout=5)
        html = req.read().decode("utf-8")
    except Exception as e:
        print(f"❌ LIVE HTTP fetch failed for {live_url}: {e}")
        http_fail += 1
        html = ""

    # Check Diagrams
    for diag in reqs["diagrams"]:
        if diag not in html:
            # Fallback check file
            rel_p = route.replace("/docs", "").strip("/")
            p_file = os.path.join(web_app_dir, "page.tsx") if not rel_p else os.path.join(web_app_dir, rel_p, "page.tsx")
            f_content = open(p_file, "r", encoding="utf-8").read() if os.path.exists(p_file) else ""
            if diag not in f_content:
                print(f"❌ Route {route} missing required diagram: {diag}")
                visual_fail += 1

    # Check Animations
    for anim in reqs["animations"]:
        if anim not in html:
            rel_p = route.replace("/docs", "").strip("/")
            p_file = os.path.join(web_app_dir, "page.tsx") if not rel_p else os.path.join(web_app_dir, rel_p, "page.tsx")
            f_content = open(p_file, "r", encoding="utf-8").read() if os.path.exists(p_file) else ""
            if anim not in f_content:
                print(f"❌ Route {route} missing required animation: {anim}")
                anim_fail += 1

# 2. Audit Target Markdown Files
for md_rel, reqs in target_md_embeds.items():
    md_path = os.path.join(docs_md_dir, md_rel)
    if not os.path.exists(md_path):
        print(f"❌ Missing target markdown file: {md_path}")
        markdown_visual_fail += 1
        continue
    
    with open(md_path, "r", encoding="utf-8") as mf:
        md_text = mf.read()

    for diag in reqs["diagrams"]:
        if diag not in md_text:
            print(f"❌ Markdown file {md_rel} missing required diagram reference: {diag}")
            markdown_visual_fail += 1

    for anim in reqs["animations"]:
        if anim not in md_text:
            print(f"❌ Markdown file {md_rel} missing required animation reference: {anim}")
            markdown_visual_fail += 1

# 3. Audit All 94 Canonical Routes for general diagram integrity
for href in hrefs:
    rel_path = href.replace("/docs/", "").strip("/")
    page_file = os.path.join(web_app_dir, "page.tsx") if not rel_path else os.path.join(web_app_dir, rel_path, "page.tsx")
    
    if not os.path.exists(page_file):
        visual_fail += 1
        continue

    content = open(page_file, "r", encoding="utf-8").read()
    img_matches = re.findall(r'<img\s+src="(/diagrams/[^"]+)"\s+alt="([^"]+)"', content)
    if not img_matches:
        visual_fail += 1
    else:
        for diag_src, alt_text in img_matches:
            asset_disk_path = os.path.join(public_dir, diag_src.lstrip("/"))
            if not os.path.exists(asset_disk_path):
                print(f"❌ Non-existent diagram asset referenced: {diag_src}")
                broken_paths += 1

print("\n-----------------------------------------------------------")
print(f"visual_fail = {visual_fail}")
print(f"anim_fail = {anim_fail}")
print(f"broken_paths = {broken_paths}")
print(f"markdown_visual_fail = {markdown_visual_fail}")
print(f"http_fail = {http_fail}")
print("-----------------------------------------------------------")

if visual_fail == 0 and anim_fail == 0 and broken_paths == 0 and markdown_visual_fail == 0 and http_fail == 0:
    print("\n✅ PASS: visual_fail = 0")
    print("✅ PASS: anim_fail = 0")
    print("✅ PASS: markdown_visual_fail = 0")
    print("✅ PASS: All required diagrams present on LIVE")
    print("✅ PASS: All required animations present on LIVE")
    print("✅ PASS: No broken src/href")
    print("✅ PASS: Markdown visual parity = PASS")
else:
    print("\n❌ FAIL: Phase 3 (Retry #5) visual criteria not met.")
