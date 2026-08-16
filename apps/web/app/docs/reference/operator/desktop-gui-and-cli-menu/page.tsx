import React from 'react';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

export default function ReferenceDesktopGuiAndCliMenuPage() {
    const filePath = path.join(process.cwd(), '../../docs/operator/desktop-gui-and-cli-menu.md');

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const markdownContent = content.replace(/^---[\s\S]*?---\n/, '');

    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white border-b border-slate-800 pb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-12 mb-6 text-white border-b border-slate-800/50 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-200" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-6" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto my-6 font-mono text-sm text-blue-300" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                        return inline ? (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono" {...props}>{children}</code>
                        ) : (
                            <code className="text-sm font-mono text-slate-300" {...props}>{children}</code>
                        );
                    },
                    table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full text-left border-collapse border border-slate-800 rounded-lg" {...props} /></div>,
                    th: ({node, ...props}) => <th className="bg-slate-900 p-3 border border-slate-800 text-slate-200 font-bold text-sm" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border border-slate-800 text-slate-300 text-sm" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-slate-200" {...props} />,
                    a: ({node, href, children, ...props}: any) => <a className="text-blue-400 hover:text-blue-300 underline" href={href} {...props}>{children}</a>,
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
}
