"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname() || "/docs";
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-400 mb-6" data-breadcrumb="true">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/docs" className="hover:text-white transition-colors font-medium">
            Docs
          </Link>
        </li>
        {breadcrumbs.slice(1).map((crumb) => (
          <li key={crumb.href} className="flex items-center space-x-2">
            <span className="text-slate-600">/</span>
            <Link href={crumb.href} className="hover:text-white transition-colors capitalize">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>

      {/* Schema.org BreadcrumbList Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": crumb.label,
              "item": `https://wnode.io${crumb.href}`,
            })),
          }),
        }}
      />
    </nav>
  );
}
