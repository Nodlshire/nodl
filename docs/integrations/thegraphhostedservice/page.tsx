import React from 'react';
import integrationData from './integration.json';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export default function Page() {
    const meta = metadataIndex.find(m => m.slug === 'thegraphhostedservice') || { 
        displayName: 'Thegraphhostedservice', 
        category: 'Other' 
    };
    
    return (
        <TemplateIntegrationPage 
            integrationData={integrationData} 
            slug="thegraphhostedservice" 
            displayName={meta.displayName} 
            category={meta.category} 
        />
    );
}
