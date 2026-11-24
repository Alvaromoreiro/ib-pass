const fs = require('fs');
const path = require('path');

const TESTS_ROOT = path.join(__dirname);
const OUTPUT_FILE = path.join(__dirname, 'all-tests.ts');

function getAllTestFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            getAllTestFiles(fullPath, fileList);
        } else if (file.endsWith('.spec.ts') || file.endsWith('.spec.js')) {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

function createImportStatements(files) {
    return files.map(file => {
        const relativePath = './' + path.relative(path.dirname(OUTPUT_FILE), file).replace(/\\/g, '/');
        return `import '${relativePath}';`;
    }).join('\n');
}

const testFiles = getAllTestFiles(TESTS_ROOT);
const importContent = createImportStatements(testFiles) + '\n';

fs.writeFileSync(OUTPUT_FILE, importContent, 'utf-8');
console.log(`✅ File generated with ${testFiles.length} imports in: ${OUTPUT_FILE}`);
