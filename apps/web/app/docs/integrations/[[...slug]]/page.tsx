import React from 'react';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import IntegrationsClient from '../../../../../../docs/integrations/components/IntegrationsClient';
import NetworkBadge from '../../../../../../docs/integrations/components/NetworkBadge';
import { parseIntegrationMetadata } from '../../../../lib/integration-utils';

export async function generateStaticParams() {
    const integrationsDir = path.join(process.cwd(), '../../docs/integrations');
    if (!fs.existsSync(integrationsDir)) return [];
    
    const files = fs.readdirSync(integrationsDir);
    const slugs = files
        .filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md')
        .map(f => ({ slug: [f.replace('.md', '')] }));
    
    // Add empty slug for index
    slugs.push({ slug: [] });
    
    return slugs;
}

export default function IntegrationPage({ params }: { params: { slug?: string[] } }) {
    const slugArray = params.slug || [];
    let slugStr = slugArray.length > 0 ? slugArray.join('/') : 'index';
    
    // Strip .md if it was provided in the URL
    if (slugStr.endsWith('.md')) {
        slugStr = slugStr.replace(/\.md$/, '');
    }
    
    const integrationsDir = path.join(process.cwd(), '../../docs/integrations');
    const filePath = path.join(integrationsDir, `${slugStr}.md`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const content = fs.readFileSync(filePath, 'utf8');

    let allIntegrations: any[] = [];
    if (slugStr === 'index') {
        const files = fs.readdirSync(integrationsDir, { withFileTypes: true });
        const dirs = files.filter(f => f.isDirectory() && f.name !== 'components' && !f.name.startsWith('_'));
        allIntegrations = dirs.map(d => parseIntegrationMetadata(d.name)).sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-5xl font-bold mb-8 text-white border-b border-slate-800 pb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-200" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto my-6" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                        return inline ? (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono" {...props}>{children}</code>
                        ) : (
                            <code className="text-sm font-mono text-slate-300" {...props}>{children}</code>
                        );
                    },
                    table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full text-left border-collapse" {...props} /></div>,
                    th: ({node, ...props}) => <th className="border-b border-slate-700 bg-slate-900/50 px-4 py-3 text-sm font-semibold text-white" {...props} />,
                    td: ({node, ...props}) => <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-slate-200" {...props} />,
                    a: ({node, href, children, ...props}: any) => {
                        const text = String(children);
                        if (href && ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'].includes(text)) {
                            return <NetworkBadge network={text} href={href} />;
                        }
                        return <a className="text-blue-400 hover:text-blue-300 underline" href={href} {...props}>{children}</a>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>

            {slugStr === 'index' && (
                <div className="mt-12 not-prose">
                    <IntegrationsClient integrations={allIntegrations} />
                </div>
            )}
        </div>
    );
}
