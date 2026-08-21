"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PageTitleContextType {
    pageTitle: string;
    pageSubtitle: string;
    setPageTitle: (title: string, subtitle?: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
    const [pageTitle, setPageTitle] = useState("");
    const [pageSubtitle, setPageSubtitle] = useState("");

    const updateTitle = (title: string, subtitle?: string) => {
        setPageTitle(title);
        setPageSubtitle(subtitle || "");
    };

    return (
        <PageTitleContext.Provider value={{ pageTitle, pageSubtitle, setPageTitle: updateTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
}

/**
 * Hook to set the page title and access the current title.
 * @param title Optional title to set on mount
 * @param subtitle Optional subtitle to set on mount
 */
export function usePageTitle(title?: string, subtitle?: string) {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error("usePageTitle must be used within a PageTitleProvider");
    }

    useEffect(() => {
        if (title) {
            context.setPageTitle(title, subtitle);
        }
    }, [title, subtitle, context]);

    return context;
}
