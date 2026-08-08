"use client";

import React, { useState, useRef, useEffect } from "react";
import AppLayout from "../../../../components/layout/AppLayout";
import AgreementsPanel from "../../../../components/dr/AgreementsPanel";
import AnalyticsPanel from "../../../../components/dr/AnalyticsPanel";
import InvestorsPanel from "../../../../components/dr/InvestorsPanel";
import InvitesPanel from "../../../../components/dr/InvitesPanel";

interface FSItem {
    name: string;
    originalName?: string;
    isDirectory: boolean;
    isLink?: boolean;
    url?: string;
    path: string;
}

const TextPreview = ({ url }: { url: string }) => {
    const [text, setText] = useState<string>("Loading...");
    useEffect(() => {
        fetch(url)
            .then(res => res.text())
            .then(setText)
            .catch(() => setText("Failed to load text preview"));
    }, [url]);
    return <pre className="w-full h-full overflow-auto p-4 bg-slate-900 text-slate-300 text-xs font-mono whitespace-pre-wrap">{text}</pre>;
};

export default function SecureDataRoomPage() {
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fsError, setFsError] = useState("");
    const [isGuest, setIsGuest] = useState(false);

    // Phase 5 State
    const [currentPath, setCurrentPath] = useState("");
    const [items, setItems] = useState<FSItem[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<FSItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Phase 6 & 9 State
    const [activeTab, setActiveTab] = useState<'files' | 'agreements' | 'analytics' | 'investors' | 'invites'>('files');

    useEffect(() => {
        fetch('/api/dr/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated && data.isGuest) {
                    setIsGuest(true);
                    setIsAuthenticated(true);
                    loadItems("");
                }
            })
            .catch(() => {});
    }, []);

    const handleAuthenticate = async () => {
        setIsLoading(true);
        setError("");
        // simulate a brief auth delay for UX polish
        await new Promise(r => setTimeout(r, 500));
        
        const expectedPassword = process.env.NEXT_PRIVATE_DOCUMENT_PASSWORD_KEY || "command123?!";
        if (passwordInput === expectedPassword) {
            setIsAuthenticated(true);
            setError("");
            await loadItems("");
        } else {
            setError("Invalid password.");
        }
        setIsLoading(false);
    };

    const loadItems = async (targetPath: string) => {
        try {
            const res = await fetch(`/api/dr/fs?path=${encodeURIComponent(targetPath)}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setCurrentPath(targetPath);
                setSelectedDocument(null);
            }
        } catch (err) {
            console.error("Failed to load items", err);
        }
    };

    const handleFolderClick = (item: FSItem) => {
        if (item.isDirectory) {
            setCurrentPath(item.path);
            setSelectedDocument(null);
            loadItems(item.path);
        } else if (item.isLink) {
            handleLinkClick(item);
        } else {
            setSelectedDocument(item);
        }
    };

    const handleLinkClick = async (item: FSItem) => {
        if (!item.isLink || !item.url) return;
        // Log event
        fetch("/api/dr/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "link_opened",
                filePath: item.path,
                fileType: "link"
            })
        });
        window.open(item.url, "_blank");
    };

    const handleDownload = () => {
        if (!selectedDocument || selectedDocument.isLink) return;
        // Note: For actual downloads, the preview route expects ?download=true
        const dlUrl = `/api/dr/preview?path=${encodeURIComponent(selectedDocument.path)}&download=true`;
        window.open(dlUrl, '_blank');
    };

    const handleCreateFolder = async () => {
        setFsError("");
        const name = prompt("Enter new folder name:");
        if (!name) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("action", "createFolder");
            formData.append("path", currentPath);
            formData.append("name", name);
            await fetch("/api/dr/fs", { method: "POST", body: formData });
            await loadItems(currentPath);
        } catch (e) {
            setFsError("Failed to create folder");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLink = async () => {
        setFsError("");
        const name = prompt("Enter link title:");
        if (!name) return;
        const url = prompt("Enter URL (e.g., https://example.com):");
        if (!url) return;
        
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("action", "createLink");
            formData.append("path", currentPath);
            formData.append("name", name);
            formData.append("url", url);
            await fetch("/api/dr/fs", { method: "POST", body: formData });
            await loadItems(currentPath);
        } catch (e) {
            setFsError("Failed to create link");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFsError("");
        const file = e.target.files?.[0];
        if (!file) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("action", "uploadFile");
            formData.append("path", currentPath);
            formData.append("file", file);
            await fetch("/api/dr/fs", { method: "POST", body: formData });
            e.target.value = "";
            await loadItems(currentPath);
        } catch (e) {
            setFsError("Failed to upload file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRename = async (item: FSItem) => {
        setFsError("");
        const newName = prompt("Enter new name:", item.name);
        if (!newName || newName === item.name) return;
        setIsLoading(true);
        try {
            await fetch("/api/dr/fs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetPath: item.path, newName })
            });
            await loadItems(currentPath);
        } catch (e) {
            setFsError("Failed to rename");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (item: FSItem) => {
        setFsError("");
        if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;
        setIsLoading(true);
        try {
            await fetch(`/api/dr/fs?path=${encodeURIComponent(item.path)}`, { method: "DELETE" });
            if (selectedDocument?.path === item.path) setSelectedDocument(null);
            await loadItems(currentPath);
        } catch (e) {
            setFsError("Failed to delete");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        const parts = currentPath.split("/").filter(Boolean);
        parts.pop();
        loadItems(parts.join("/"));
    };

    if (isAuthenticated) {
        const folders = items.filter(i => i.isDirectory);
        const docsAndLinks = items.filter(i => !i.isDirectory);

        return (
            <AppLayout>
                <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8 selection:bg-blue-500/30">
                    <div className="max-w-full w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        {/* LEFT SIDEBAR */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-white/10 pb-4">Menu</h3>
                                <div className="space-y-4 relative">
                                    {isLoading && <div className="absolute inset-0 bg-black/20 z-10 rounded-lg flex items-center justify-center backdrop-blur-[1px]"><span className="text-xs font-bold uppercase tracking-widest text-blue-400 animate-pulse">Loading...</span></div>}
                                    <button onClick={() => { setActiveTab('files'); loadItems(""); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border ${activeTab === 'files' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>Folders & Files</button>
                                    
                                    {!isGuest && (
                                        <>
                                            <button onClick={() => setActiveTab('agreements')} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border ${activeTab === 'agreements' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>Agreements</button>
                                            <button onClick={() => setActiveTab('invites')} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border ${activeTab === 'invites' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>Access & Invites</button>
                                            <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border ${activeTab === 'analytics' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>Analytics</button>
                                            <button onClick={() => setActiveTab('investors')} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border ${activeTab === 'investors' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>Investors</button>
                                        </>
                                    )}
                                    
                                    {activeTab === 'files' && !isGuest && (
                                        <>
                                            <div className="pt-4 border-t border-white/10 space-y-4">
                                                <button onClick={handleCreateFolder} disabled={isLoading} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/5 disabled:opacity-50">📁 Create Folder</button>
                                                <button onClick={handleCreateLink} disabled={isLoading} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/5 disabled:opacity-50">🔗 Create Link</button>
                                                <button onClick={handleUploadClick} disabled={isLoading} className="w-full text-left px-4 py-3 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm text-blue-400 font-bold transition-colors border border-blue-500/30 disabled:opacity-50">Upload Document</button>
                                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* MAIN PANEL */}
                        <div className="lg:col-span-3 space-y-6">
                            {activeTab === 'agreements' ? (
                                <AgreementsPanel />
                            ) : activeTab === 'analytics' ? (
                                <AnalyticsPanel />
                            ) : activeTab === 'investors' ? (
                                <InvestorsPanel />
                            ) : activeTab === 'invites' ? (
                                <InvitesPanel />
                            ) : (
                                <>
                                    {fsError && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-lg font-bold">{fsError}</div>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 min-h-[250px] flex flex-col">
                                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                                                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{currentPath ? `/${currentPath}` : "/ (Root)"}</span>
                                                {currentPath && <button onClick={handleBackClick} className="text-[10px] text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold">Back</button>}
                                            </div>
                                            <div className="flex-1 overflow-y-auto space-y-2">
                                                {folders.map(folder => (
                                                    <div key={folder.path} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg group transition-colors cursor-pointer" onClick={() => handleFolderClick(folder)}>
                                                        <span className="text-sm font-medium text-white/80">📁 {folder.name}</span>
                                                        {!isGuest && (
                                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={(e) => { e.stopPropagation(); handleRename(folder); }} className="text-xs text-slate-400 hover:text-white uppercase tracking-widest">Rename</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(folder); }} className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 min-h-[250px] flex flex-col">
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/10 block">Items in this folder</span>
                                            <div className="flex-1 overflow-y-auto space-y-2">
                                                {docsAndLinks.map(item => (
                                                    <div key={item.path} className={`flex items-center justify-between p-3 rounded-lg group transition-colors cursor-pointer ${selectedDocument?.path === item.path ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/5 hover:bg-white/10'}`} onClick={() => handleFolderClick(item)}>
                                                        <span className="text-sm font-medium text-white/80">{item.isLink ? '🔗' : '📄'} {item.name}</span>
                                                        {!isGuest && (
                                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={(e) => { e.stopPropagation(); handleRename(item); }} className="text-xs text-slate-400 hover:text-white uppercase tracking-widest">Rename</button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item); }} className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest">Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Panel */}
                                    <div className="bg-[#080808] border border-white/10 rounded-2xl p-6 min-h-[600px] lg:h-[85vh] flex flex-col">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
                                            <span>Preview</span>
                                            {selectedDocument && !selectedDocument.isLink && (
                                                <button onClick={handleDownload} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded transition-colors">Download</button>
                                            )}
                                        </h3>
                                        <div className="flex-1 rounded-lg overflow-hidden flex items-center justify-center relative bg-black/50">
                                            {selectedDocument ? (
                                                selectedDocument.isLink ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 p-8 text-center">
                                                        <span className="text-6xl">🔗</span>
                                                        <h4 className="text-white font-bold">{selectedDocument.name}</h4>
                                                        <p className="text-xs break-all opacity-50">{selectedDocument.url}</p>
                                                        <button onClick={() => handleLinkClick(selectedDocument)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-bold uppercase tracking-widest text-xs">Open Link</button>
                                                    </div>
                                                ) : (
                                                    (() => {
                                                        const ext = selectedDocument.name.split('.').pop()?.toLowerCase() || '';
                                                        const previewUrl = `/api/dr/preview?path=${encodeURIComponent(selectedDocument.path)}`;
                                                        if (['mp4', 'webm', 'mov'].includes(ext)) return <video src={previewUrl} controls className="w-full h-full object-contain" />;
                                                        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <img src={previewUrl} alt={selectedDocument.name} className="w-full h-full object-contain" />;
                                                        if (['txt', 'md', 'json', 'log'].includes(ext)) return <TextPreview url={previewUrl} />;
                                                        return <iframe src={previewUrl} className="w-full h-full bg-white border-0" />;
                                                    })()
                                                )
                                            ) : (
                                                <span className="text-slate-600 text-sm">Select a file to preview</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center selection:bg-blue-500/30">
                <div className="max-w-md w-full mx-auto p-10 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent opacity-50" />
                    
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
                        <div>
                            <h2 className="text-2xl font-black lowercase tracking-tighter mb-2">Secure Access</h2>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">WeNode Data Room</p>
                        </div>
                        
                        <div className="space-y-4">
                            <input 
                                type="password" 
                                placeholder="Enter Access Password" 
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
                                disabled={isLoading}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center tracking-widest disabled:opacity-50"
                            />
                            {error && (
                                <p className="text-red-500 text-xs tracking-widest uppercase">{error}</p>
                            )}
                            <button 
                                onClick={handleAuthenticate}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-50"
                            >
                                {isLoading ? "Authenticating..." : "Authenticate"}
                            </button>
                        </div>
                        
                        <div className="pt-4 border-t border-white/5">
                            <button className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest transition-colors font-bold">
                                Request Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
