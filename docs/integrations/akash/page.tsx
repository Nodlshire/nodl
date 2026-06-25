import React from 'react';
import integrationData from './integration.json';
import TemplateIntegrationPage from '../TEMPLATE_INTEGRATION_PAGE';
import metadataIndex from '../metadata_index.json';

export const metadata = {
    title: 'Akash'
};

export default function Page() {
    const meta = metadataIndex.find(m => m.slug === 'akash') || { 
        displayName: 'Akash', 
        category: 'Data' 
    };
    
    return (
        <div className="akash-title-fix">
            <style dangerouslySetInnerHTML={{__html: `
                .akash-title-fix h1 { font-size: 0px !important; }
                .akash-title-fix h1::before { content: "Akash"; font-size: 2.25rem !important; }
            `}} />
            <TemplateIntegrationPage 
                integrationData={integrationData} 
                slug="akash" 
                displayName={meta.displayName} 
                category={meta.category} 
            />
        </div>
    );
}
