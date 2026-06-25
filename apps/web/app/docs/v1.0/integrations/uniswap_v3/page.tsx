import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'uniswap_v3') || { 
        name: 'uniswap_v3', 
        displayName: 'uniswap_v3', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="uniswap_v3" />
    );
}
