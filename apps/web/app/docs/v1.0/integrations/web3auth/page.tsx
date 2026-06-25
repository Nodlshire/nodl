import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'web3auth') || { 
        name: 'web3auth', 
        displayName: 'web3auth', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="web3auth" />
    );
}
