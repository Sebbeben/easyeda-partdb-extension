import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';

const ROOT = path.resolve(__dirname, '..');
const extensionConfig = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'extension.json'), 'utf-8')
);

// Read .edaignore patterns
const ignorePatterns = fs
    .readFileSync(path.join(ROOT, '.edaignore'), 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

function shouldIgnore(filePath: string): boolean {
    const normalized = '/' + filePath.replace(/\\/g, '/');
    return ignorePatterns.some((pattern) => {
        const p = pattern.replace(/\\/g, '/');
        if (p.endsWith('/')) {
            return normalized.startsWith(p) || normalized.includes(p);
        }
        return normalized === p || normalized.endsWith(p);
    });
}

function collectFiles(dir: string, base: string = ''): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = base ? `${base}/${entry.name}` : entry.name;
        if (shouldIgnore(`/${rel}`) || shouldIgnore(`/${rel}/`)) continue;
        if (entry.isDirectory()) {
            files.push(...collectFiles(path.join(dir, entry.name), rel));
        } else {
            files.push(rel);
        }
    }
    return files;
}

// Ensure output directory exists
const outDir = path.join(ROOT, 'build', 'dist');
fs.mkdirSync(outDir, { recursive: true });

const files = collectFiles(ROOT);
const zip = new JSZip();

for (const file of files) {
    zip.file(file, fs.createReadStream(path.join(ROOT, file)));
}

const outName = `${extensionConfig.name}_v${extensionConfig.version}.eext`;
const outPath = path.join(outDir, outName);

zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(outPath))
    .on('finish', () => {
        console.log(`Packaged: ${outPath}`);
        console.log(`Files included: ${files.length}`);
    });
