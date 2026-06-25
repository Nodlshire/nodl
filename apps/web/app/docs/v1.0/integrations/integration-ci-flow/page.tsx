import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'integration-ci-flow') || { 
        name: 'integration-ci-flow', 
        displayName: 'integration-ci-flow', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="integration-ci-flow" />
    );
}
