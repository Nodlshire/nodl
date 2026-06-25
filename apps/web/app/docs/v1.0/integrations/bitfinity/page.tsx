import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'bitfinity') || { 
        name: 'bitfinity', 
        displayName: 'bitfinity', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="bitfinity" />
    );
}
