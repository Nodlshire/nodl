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

    const updateTitle = React.useCallback((title: string, subtitle?: string) => {
        setPageTitle(title);
        setPageSubtitle(subtitle || "");
    }, []);

    const value = React.useMemo(() => ({
        pageTitle,
        pageSubtitle,
        setPageTitle: updateTitle
    }), [pageTitle, pageSubtitle, updateTitle]);

    return (
        <PageTitleContext.Provider value={value}>
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
    
    useEffect(() => {
        if (context && title) {
            context.setPageTitle(title, subtitle);
        }
    }, [title, subtitle, context]);

    if (!context) {
        return {
            pageTitle: title || "",
            pageSubtitle: subtitle || "",
            setPageTitle: () => {},
        };
    }

    return context;
}
