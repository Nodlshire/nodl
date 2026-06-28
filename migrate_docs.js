const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const docsSrcDir = path.join(rootDir, 'docs/v1.0');
const docsDestDir = path.join(rootDir, 'docs');
const webDocsSrcDir = path.join(rootDir, 'apps/web/app/docs/v1.0');
const webDocsDestDir = path.join(rootDir, 'apps/web/app/docs');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const exists = fs.existsSync(dest);
  const stats = exists && fs.statSync(dest);
  const isDirectory = fs.statSync(src).isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Migrating docs/v1.0...');
if (fs.existsSync(docsSrcDir)) {
  copyRecursiveSync(docsSrcDir, docsDestDir);
  fs.rmSync(docsSrcDir, { recursive: true, force: true });
}

console.log('Migrating apps/web/app/docs/v1.0...');
if (fs.existsSync(webDocsSrcDir)) {
  copyRecursiveSync(webDocsSrcDir, webDocsDestDir);
  fs.rmSync(webDocsSrcDir, { recursive: true, force: true });
}

console.log('Updating internal links...');

const directoriesToScan = [
  path.join(rootDir, 'apps'),
  path.join(rootDir, 'docs'),
  path.join(rootDir, 'packages'),
  path.join(rootDir, 'scripts'),
  rootDir
];

const extensions = ['.md', '.tsx', '.ts', '.js', '.json', '.go'];
const excludeDirs = ['node_modules', '.next', '.git', '.turbo'];

function processDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (excludeDirs.includes(file)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      if (fullPath === __filename) continue; // Don't modify this script
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      if (content.includes('/docs/v1.0')) {
        content = content.replace(/\/docs\/v1\.0/g, '/docs');
        modified = true;
      }
      if (content.includes('docs/v1.0')) {
        content = content.replace(/docs\/v1\.0/g, 'docs');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated links in: ' + fullPath);
      }
    }
  }
}

for (const dir of directoriesToScan) {
  if (dir === rootDir) {
    // only scan root files, not dirs to avoid infinite recursion
    fs.readdirSync(rootDir).forEach(f => {
      const fullPath = path.join(rootDir, f);
      if (fs.statSync(fullPath).isFile() && extensions.includes(path.extname(fullPath))) {
        if (fullPath === __filename) return;
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        if (content.includes('/docs/v1.0')) {
          content = content.replace(/\/docs\/v1\.0/g, '/docs');
          modified = true;
        }
        if (content.includes('docs/v1.0')) {
          content = content.replace(/docs\/v1\.0/g, 'docs');
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Updated links in: ' + fullPath);
        }
      }
    });
  } else {
    processDirectory(dir);
  }
}

console.log('Migration complete.');
