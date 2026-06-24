const fs = require('fs');
const path = require('path');

async function validateLinks() {
    const dataPath = path.join(__dirname, 'app', 'docs', 'v1.0', 'integrations', 'list', 'data.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');
    
    // Extract paths
    const regex = /path:\s*"([^"]+)"/g;
    const paths = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        paths.push(match[1]);
    }
    
    console.log(`Checking ${paths.length} links...`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Batch process to avoid socket exhaustion
    const batchSize = 50;
    for (let i = 0; i < paths.length; i += batchSize) {
        const batch = paths.slice(i, i + batchSize);
        const promises = batch.map(async (p) => {
            try {
                const res = await fetch(`http://localhost:3004${p}`);
                if (res.status === 200) {
                    successCount++;
                } else {
                    console.error(`Failed: ${p} - Status: ${res.status}`);
                    failCount++;
                }
            } catch (err) {
                console.error(`Error fetching ${p}:`, err.message);
                failCount++;
            }
        });
        await Promise.all(promises);
    }
    
    console.log(`\nValidation Complete!`);
    console.log(`Total Checked: ${paths.length}`);
    console.log(`Success (200 OK): ${successCount}`);
    console.log(`Failed (404/Other): ${failCount}`);
    
    if (failCount > 0) process.exit(1);
}

validateLinks();
