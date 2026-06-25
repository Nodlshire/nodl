import React from 'react';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const metadata = metadataIndex.find(m => m.slug === 'coinbase_tokenize') || { 
        name: 'coinbase_tokenize', 
        displayName: 'coinbase_tokenize', 
        category: 'Other' 
    };

    return (
        <TemplateIntegrationPage {...metadata} name="coinbase_tokenize" />
    );
}
