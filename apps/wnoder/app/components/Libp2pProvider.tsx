'use client';

import { useEffect } from 'react';
import { startNodlNode, stopNodlNode } from '../../lib/libp2p-client';
import { IntegrityModal } from './IntegrityModal';

export const Libp2pProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        startNodlNode();
        return () => {
            stopNodlNode();
        };
    }, []);

    return (
        <>
            <IntegrityModal />
            {children}
        </>
    );
};
