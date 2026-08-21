const fs = require('fs');
const path = require('path');

const INTEGRATIONS_DIR = '/home/obregan/Documents/nodl/docs/integrations';
const METADATA_PATH = '/home/obregan/Documents/nodl/apps/web/app/docs/integrations/metadata_index.json';
const TEMPLATE_PATH = path.join(INTEGRATIONS_DIR, '_template.md');

const SKIP_FILES = [
  'aave.md',
  'adapter.md',
  'blockchain.md',
  'future_candidates.md',
  'index.md',
  'non_mev_integrations.md',
  'operators.md',
  'oracles.md',
  'overview.md',
  'registry.md',
  'storage.md',
  'wave1_integrations.md',
  'wave2_integrations.md',
  'wave3_integrations.md',
  'web2.md',
  '_template.md'
];

function generateCanonicalMarkdown(slug, displayName, networks) {
    let networkBadges = '';
    if (networks && networks.length > 0) {
        networkBadges = networks.map(n => {
            const formattedName = n.trim().replace(' Mainnet', '').replace(' Beta', '');
            const networkSlug = formattedName.toLowerCase().replace(' ', '-');
            return `[${formattedName}](/docs/integrations/${networkSlug})`;
        }).join(' ');
    } else {
        networkBadges = '[Ethereum](/docs/integrations/ethereum)'; // Default safe badge
    }

    return `# ${displayName}

## 1. Summary
To be populated in Phase 2.3.

## 2. Verified Metadata Block
- **Integration Name**: ${displayName}
- **Version**: 1.0.0
- **Determinism Profile**: Awaiting verified architectural review.
- **Capability Set**: To be determined.
- **Supported Networks**: ${networkBadges}
- **Adapter Hash**: To be generated.
- **Last Updated**: 2026-06-28

## 3. Protocol Overview
To be populated in Phase 2.3.

## 4. Deterministic Adapter Specification
To be populated in Phase 2.3.

## 5. Canonical ABI Signatures
To be populated in Phase 2.3.

## 6. Deterministic Error Code Table
To be populated in Phase 2.3.

## 7. Proof of Compute Pipeline
To be populated in Phase 2.3.

## 8. Workflow Usage Examples
To be populated in Phase 2.3.

## 9. Security & Determinism Model
To be populated in Phase 2.3.

## 10. Operator Controls
To be populated in Phase 2.3.

## 11. Capability Map
To be populated in Phase 2.3.

## 12. Determinism Profile
To be populated in Phase 2.3.

## 13. Integration Architecture Diagram
To be populated in Phase 2.3.

## 14. Testing & Validation
To be populated in Phase 2.3.

## 15. Example Scenarios
To be populated in Phase 2.3.

## 16. References & Sources
To be populated in Phase 2.3.
`;
}

async function main() {
    console.log("Reading metadata index...");
    const metadataRaw = fs.readFileSync(METADATA_PATH, 'utf8');
    const metadata = JSON.parse(metadataRaw);

    // Get all files in directory
    const files = fs.readdirSync(INTEGRATIONS_DIR).filter(f => f.endsWith('.md'));
    const existingSlugs = files.filter(f => !SKIP_FILES.includes(f)).map(f => f.replace('.md', ''));

    // Combine metadata slugs and existing slugs
    const metadataSlugs = metadata.map(m => m.slug);
    const unifiedSlugs = [...new Set([...metadataSlugs, ...existingSlugs])];

    console.log(`Found ${unifiedSlugs.length} distinct integrations to process.`);

    let generatedCount = 0;

    for (const slug of unifiedSlugs) {
        if (SKIP_FILES.includes(`${slug}.md`)) continue;

        // Try to find metadata
        let meta = metadata.find(m => m.slug === slug);
        if (!meta) {
            // It was an existing file without metadata. Let's create an entry.
            meta = {
                slug: slug,
                displayName: slug.charAt(0).toUpperCase() + slug.slice(1),
                category: "Other",
                chain: "Unknown",
                networks: [],
                tags: []
            };
            metadata.push(meta);
        }

        const mdContent = generateCanonicalMarkdown(slug, meta.displayName, meta.networks || []);
        fs.writeFileSync(path.join(INTEGRATIONS_DIR, `${slug}.md`), mdContent);
        generatedCount++;
    }

    // Save metadata_index.json with any updates (ensuring all entries are there, slugs match, etc.)
    metadata.forEach(m => {
        if (!m.category) m.category = "Other";
        if (!m.networks) m.networks = [];
        if (!m.tags) m.tags = [];
    });

    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));

    console.log(`Successfully generated/overwrote ${generatedCount} canonical integration pages.`);
}

main();
