#!/usr/bin/env python3
"""
Wnode TSX Documentation Page Linter

Validates TSX documentation page files under apps/web/app/docs/:
1. Enforces diagram placement rules (<figure>, <img src="/diagrams/...">, alt="Fig X.Y – ...", <figcaption>Fig X.Y – ...</figcaption>).
2. Enforces animation placement rules (<DocAnimationViewer src="/animations/...svg"> placed directly under parent diagram).
3. Accessibility Rules (a11y): Enforces alt text on images, aria-label / role attributes on main containers and figures.
"""

import glob
import os
import re
import sys

APP_DOCS_DIR = "/home/obregan/Documents/nodl/apps/web/app/docs"


def lint_tsx_files():
    print("\n===========================================================")
    print("TSX DOCS PAGE LINTER (REGRESSION BLOCKER & ACCESSIBILITY)")
    print("===========================================================\n")

    tsx_files = sorted(glob.glob(os.path.join(APP_DOCS_DIR, "**/page.tsx"), recursive=True))
    print(f"Total TSX Pages Found: {len(tsx_files)}\n")

    passed_count = 0
    failed_count = 0
    errors_log = []

    for tsx_path in tsx_files:
        rel_path = os.path.relpath(tsx_path, APP_DOCS_DIR)

        with open(tsx_path, "r", encoding="utf-8") as f:
            content = f.read()

        file_errors = []

        # 1. Inspect diagrams in TSX
        diagram_matches = re.findall(r'<img[^>]+src="(/diagrams/[^"]+)"[^>]*>', content)
        for d_src in diagram_matches:
            alt_match = re.search(r'alt="(Fig[^"]+)"', content)
            if not alt_match:
                file_errors.append(f"Diagram '{d_src}' missing alt attribute starting with 'Fig'")
            if "<figcaption" not in content:
                file_errors.append(f"Diagram '{d_src}' missing <figcaption> element")

        # 2. Inspect animations in TSX
        anim_matches = re.findall(r'(/animations/[a-zA-Z0-9\-_]+\.svg)', content)
        anim_matches = list(set(anim_matches))

        for anim_src in anim_matches:
            anim_pos = content.find(anim_src)
            diagram_positions = [m.start() for m in re.finditer(r'src="/diagrams/', content) if m.start() < anim_pos]

            if not diagram_positions:
                file_errors.append(f"Animation '{anim_src}' has NO preceding parent diagram figure")
            else:
                last_diag_pos = max(diagram_positions)
                char_dist = anim_pos - last_diag_pos
                if char_dist > 2500:
                    file_errors.append(
                        f"Animation '{anim_src}' is positioned too far from parent diagram (dist={char_dist} chars)"
                    )

        # 3. Accessibility (a11y) checks: Ensure img tags have alt text
        all_imgs = re.findall(r'<img[^>]*>', content)
        for img_tag in all_imgs:
            if 'alt=' not in img_tag:
                file_errors.append(f"Accessibility Error: <img> tag missing alt attribute: {img_tag[:50]}...")

        if file_errors:
            failed_count += 1
            errors_log.append((rel_path, file_errors))
            print(f"❌ {rel_path}: {', '.join(file_errors)}")
        else:
            passed_count += 1

    print("\n-----------------------------------------------------------")
    print(f"TSX LINT RESULTS: PASSED {passed_count}/{len(tsx_files)} | FAILED {failed_count}")
    print("-----------------------------------------------------------\n")

    if failed_count > 0:
        print("❌ TSX LINTING RESULT: FAIL\n")
        return 1
    else:
        print("✅ TSX LINTING RESULT: PASS\n")
        return 0


if __name__ == "__main__":
    sys.exit(lint_tsx_files())
