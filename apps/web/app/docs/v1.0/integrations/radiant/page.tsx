import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'radiant') || { 
        name: 'radiant', 
        displayName: 'radiant', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="radiant" />
    );
}
