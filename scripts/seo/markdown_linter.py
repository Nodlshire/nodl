#!/usr/bin/env python3
"""
Wnode Markdown Documentation Linter

Validates all Markdown Single Source of Truth (SOT) files under /docs/:
1. Enforces minimum word count (>= 800 words per file).
2. Enforces presence of diagram figure blocks (<figure> or ![...](/diagrams/...)).
3. Enforces presence of animation viewer tags where applicable.
4. Enforces valid figure captions and figure numbering (Fig X.Y).
5. SEO Header Rules: Enforces H1 title (# ...) and H2 section headers (## ...).
"""

import glob
import os
import re
import sys

DOCS_MD_DIR = "/home/obregan/Documents/nodl/docs"
LAYOUT_FILE = "/home/obregan/Documents/nodl/apps/web/app/docs/layout.tsx"


def get_mapped_markdown_files():
    with open(LAYOUT_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    routes = sorted(list(set(re.findall(r'href="(/docs[^"]*)"', content))))
    if "/docs" not in routes:
        routes.insert(0, "/docs")

    all_md_files = {
        os.path.relpath(p, DOCS_MD_DIR): p
        for p in glob.glob(os.path.join(DOCS_MD_DIR, "**/*.md"), recursive=True)
    }

    mapped_files = {}
    for r in routes:
        rel = r.replace("/docs", "").strip("/")
        if not rel:
            for candidate in ["INDEX.md", "index.md", "README.md", "docs.md"]:
                if candidate in all_md_files:
                    mapped_files[r] = all_md_files[candidate]
                    break
        else:
            parts = rel.split("/")
            exact_candidate = f"{rel}.md"
            found = None
            for md_rel, md_abs in all_md_files.items():
                clean_md_rel = re.sub(r"^\d+-", "", md_rel)
                clean_md_rel = re.sub(r"/\d+-", "/", clean_md_rel)
                if clean_md_rel == exact_candidate or md_rel == exact_candidate:
                    found = md_abs
                    break
            if not found:
                last = parts[-1]
                for md_rel, md_abs in all_md_files.items():
                    if "archive" in md_rel:
                        continue
                    if os.path.basename(md_abs).replace(".md", "") == last:
                        found = md_abs
                        break
            if not found:
                last = parts[-1]
                for md_rel, md_abs in all_md_files.items():
                    if os.path.basename(md_abs).replace(".md", "") == last:
                        found = md_abs
                        break
            if found:
                mapped_files[r] = found

    return mapped_files


def lint_markdown_files():
    print("\n===========================================================")
    print("MARKDOWN SOT LINTER (REGRESSION BLOCKER & SEO HEADERS)")
    print("===========================================================\n")

    mapped_files = get_mapped_markdown_files()
    print(f"Total Mapped Routes to Lint: {len(mapped_files)}\n")

    passed_count = 0
    failed_count = 0
    errors = []

    for route, md_path in mapped_files.items():
        if not os.path.exists(md_path):
            msg = f"Markdown file does not exist: {md_path}"
            errors.append((route, md_path, [msg]))
            failed_count += 1
            continue

        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        file_errors = []

        # 1. Enforce minimum word count >= 800 words
        words = len(content.split())
        if words < 800:
            file_errors.append(f"Thin markdown content ({words} words < 800 required)")

        # 2. Enforce figure blocks presence
        has_fig_tag = "<figure>" in content or "<figure " in content
        has_fig_img = "/diagrams/" in content or "![" in content
        if not (has_fig_tag or has_fig_img):
            file_errors.append("Missing diagram figure block or image reference")

        # 3. Enforce figure number formatting (Fig X.Y)
        if "/diagrams/" in content:
            if not re.search(r"Fig\s+[0-9]+(?:\.[0-9]+)?", content):
                file_errors.append("Diagram reference present but missing 'Fig X.Y' caption tag")

        # 4. Enforce animation blocks where applicable
        if "/animations/" in content:
            if "<DocAnimationViewer" not in content and "animation-src" not in content:
                file_errors.append("Animation reference present but missing <DocAnimationViewer> component tag")

        # 5. SEO Header Rules: Enforce H1 (# Title) and H2 (## Section) headers
        has_h1 = bool(re.search(r"^#\s+[^\n]+", content, re.MULTILINE))
        has_h2 = bool(re.search(r"^##\s+[^\n]+", content, re.MULTILINE))
        if not has_h1:
            file_errors.append("SEO Header Rule: Missing H1 title header (# ...)")
        if not has_h2:
            file_errors.append("SEO Header Rule: Missing H2 section header (## ...)")

        if file_errors:
            errors.append((route, md_path, file_errors))
            failed_count += 1
            print(f"❌ {route} ({os.path.basename(md_path)}): {', '.join(file_errors)}")
        else:
            passed_count += 1

    print("\n-----------------------------------------------------------")
    print(f"MARKDOWN LINT RESULTS: PASSED {passed_count}/{len(mapped_files)} | FAILED {failed_count}")
    print("-----------------------------------------------------------\n")

    if failed_count > 0:
        print("❌ MARKDOWN LINTING RESULT: FAIL\n")
        return 1
    else:
        print("✅ MARKDOWN LINTING RESULT: PASS\n")
        return 0


if __name__ == "__main__":
    sys.exit(lint_markdown_files())
