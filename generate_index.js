const fs = require('fs');
const path = require('path');

const integrationsDir = path.join(__dirname, 'docs/integrations');
const files = fs.readdirSync(integrationsDir);

let integrations = files
    .filter(f => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('_'))
    .map(f => {
        const name = f.replace('.md', '');
        return { name, title: name.charAt(0).toUpperCase() + name.slice(1) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

let md = `# Sovereign Mesh Integrations\n\n`;

// Search (HTML)
md += `<div class="mb-8 relative"><input type="text" id="integration-search" placeholder="Search integrations..." class="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors" /></div>\n\n`;

// Categories
md += `<div class="flex flex-wrap gap-2 mb-8 category-filters"><button class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">All</button><button class="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">DeFi</button><button class="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">Bridge</button><button class="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">Oracle</button></div>\n\n`;

// Quick jump anchors
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
md += `<div class="flex flex-wrap gap-2 mb-12 text-sm quick-jump">\n`;
for (let letter of alphabet) {
    const hasLetter = integrations.some(i => i.title.toUpperCase().startsWith(letter));
    if (hasLetter) {
        md += `[${letter}](#${letter.toLowerCase()}) &nbsp;|&nbsp; `;
    } else {
        md += `<span class="text-slate-600">${letter}</span> &nbsp;|&nbsp; `;
    }
}
md += `</div>\n\n`;

// Generate grid by letter
for (let letter of alphabet) {
    const letterIntegrations = integrations.filter(i => i.title.toUpperCase().startsWith(letter));
    if (letterIntegrations.length > 0) {
        md += `## <a name="${letter.toLowerCase()}"></a>${letter}\n\n`;
        md += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 integrations-grid">\n`;
        for (let int of letterIntegrations) {
            md += `
<a href="/docs/integrations/${int.name}" class="group no-underline block integration-card" data-title="${int.title.toLowerCase()}">
    <div class="h-full bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300">
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 m-0">${int.title}</h3>
        <p class="text-sm text-slate-500 m-0">Deterministic Integration</p>
    </div>
</a>\n`;
        }
        md += `</div>\n\n`;
    }
}

fs.writeFileSync(path.join(integrationsDir, 'index.md'), md);
console.log('index.md generated');
