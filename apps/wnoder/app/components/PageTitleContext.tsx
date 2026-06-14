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
        pageSubtitle && setPageSubtitle(subtitle || "");
    }, [pageSubtitle]);

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

export function usePageTitle(title?: string, subtitle?: string) {
    const context = useContext(PageTitleContext);
    if (!context) {
        throw new Error("usePageTitle must be used within a PageTitleProvider");
    }

    const { setPageTitle } = context;

    useEffect(() => {
        if (title) {
            setPageTitle(title, subtitle);
        }
    }, [title, subtitle, setPageTitle]);

    return context;
}
