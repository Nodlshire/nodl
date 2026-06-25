import React from 'react';
import fs from 'fs';
import path from 'path';
import IntegrationsClient from './components/IntegrationsClient';
import { parseIntegrationMetadata, IntegrationMeta } from '../../../../lib/integration-utils';

export default function IntegrationsPage() {
    // Dynamically list all integration directories
    const integrationsDir = path.join(process.cwd(), 'app/docs/v1.0/integrations');
    let integrations: IntegrationMeta[] = [];
    
    try {
        const entries = fs.readdirSync(integrationsDir, { withFileTypes: true });
        const dirNames = entries
            .filter(entry => entry.isDirectory() && entry.name !== 'TEMPLATE_V2' && entry.name !== 'TEMPLATE_V3' && entry.name !== 'components')
            .map(entry => entry.name)
            .sort();
            
        integrations = dirNames.map(name => parseIntegrationMetadata(name));
    } catch (err) {
        console.error("Failed to read integrations directory", err);
    }

    return (
        <div className="w-full pb-24">
            {/* Inject CSS to override layout max-width specifically for the integrations registry */}
            <style dangerouslySetInnerHTML={{ __html: `
                main .max-w-\\[880px\\] { max-width: 100% !important; }
            `}} />

            <div className="flex items-center justify-between mb-[32px]">
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] leading-tight tracking-tight">Integrations Registry</h1>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-sm font-bold font-mono">
                    {integrations.length} PROTOCOLS
                </span>
            </div>


            <IntegrationsClient integrations={integrations} />
        </div>
    );
}
