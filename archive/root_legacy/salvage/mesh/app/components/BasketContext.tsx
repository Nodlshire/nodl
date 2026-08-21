'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BasketItem {
    id: string;
    name: string;
    tier: string;
    price: string;
    cpu_cores: number;
    ram_gb: number;
    gpu_model: string;
}

interface BasketContextType {
    items: BasketItem[];
    addItem: (item: BasketItem) => void;
    removeItem: (id: string) => void;
    clearBasket: () => void;
    totalItems: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<BasketItem[]>([]);

    // Persist basket in localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mesh_basket');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse basket:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('mesh_basket', JSON.stringify(items));
    }, [items]);

    const addItem = (item: BasketItem) => {
        setItems(prev => [...prev, { ...item, id: `${item.tier}-${Date.now()}` }]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const clearBasket = () => {
        setItems([]);
    };

    return (
        <BasketContext.Provider value={{ items, addItem, removeItem, clearBasket, totalItems: items.length }}>
            {children}
        </BasketContext.Provider>
    );
}

export function useBasket() {
    const context = useContext(BasketContext);
    if (context === undefined) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
}
