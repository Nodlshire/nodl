import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'hivemapper') || { 
        name: 'hivemapper', 
        displayName: 'hivemapper', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="hivemapper" />
    );
}
