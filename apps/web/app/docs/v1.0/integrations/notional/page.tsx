import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'notional') || { 
        name: 'notional', 
        displayName: 'notional', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="notional" />
    );
}
