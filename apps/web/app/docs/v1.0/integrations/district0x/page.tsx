import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'district0x') || { 
        name: 'district0x', 
        displayName: 'district0x', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="district0x" />
    );
}
