"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface MeshHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs: Breadcrumb[];
    icon?: React.ElementType;
}

export function MeshHeader({ title, subtitle, breadcrumbs, icon: Icon }: MeshHeaderProps) {
    usePageTitle(title, subtitle);
    
    // If there are no breadcrumbs, we don't need to render anything here as title/subtitle
    // are now handled by the Shell's global header.
    if (breadcrumbs.length === 0) return null;

    return (
        <header className="flex flex-col gap-4 mb-8">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Link href="/mesh" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    Mesh
                </Link>
                {breadcrumbs.map((bc, idx) => (
                    <React.Fragment key={idx}>
                        <span className="text-slate-700">/</span>
                        {bc.href ? (
                            <Link href={bc.href} className="hover:text-cyan-400 transition-colors">
                                {bc.label}
                            </Link>
                        ) : (
                            <span className="text-slate-300">{bc.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </header>
    );
}
