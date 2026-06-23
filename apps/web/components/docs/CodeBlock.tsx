import React from 'react';

interface CodeBlockProps {
    language?: string;
    title?: string;
    children: React.ReactNode;
}

export default function CodeBlock({ language = 'plaintext', title, children }: CodeBlockProps) {
    return (
        <div className="my-8 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] not-prose shadow-2xl">
            {title && (
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">{title}</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">{language}</span>
                </div>
            )}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                    <code>{children}</code>
                </pre>
            </div>
        </div>
    );
}
