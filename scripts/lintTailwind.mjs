// Reports Tailwind classes that have a shorter canonical form (the "can be written as" hints
// of the Tailwind CSS IntelliSense extension), for every class string in src/**/*.tsx.
// Exits with 1 when there are suggestions. Skips class names built with ${...} interpolation.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

import { __unstable__loadDesignSystem as loadDesignSystem } from '@tailwindcss/node';

const root = process.cwd();
const stylesDirectory = join(root, 'src/styles');
const stylesheet = readFileSync(join(stylesDirectory, 'theme.css'), 'utf8');
const designSystem = await loadDesignSystem(stylesheet, { base: stylesDirectory });

function findComponentFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
            return findComponentFiles(path);
        }
        return path.endsWith('.tsx') ? [path] : [];
    });
}

const suggestions = [];
for (const file of findComponentFiles(join(root, 'src'))) {
    readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
            for (const [, , text] of line.matchAll(/(["'`])((?:(?!\1).)*)\1/g)) {
                for (const candidate of text.split(/\s+/)) {
                    if (!candidate || candidate.includes('${')) {
                        continue;
                    }
                    const [canonical] = designSystem.canonicalizeCandidates([candidate]);
                    if (canonical && canonical !== candidate) {
                        suggestions.push(
                            `${relative(root, file)}:${index + 1}  ${candidate}  ->  ${canonical}`,
                        );
                    }
                }
            }
        });
}

if (suggestions.length > 0) {
    process.stdout.write(`${suggestions.join('\n')}\n\n${suggestions.length} suggestion(s).\n`);
    process.exit(1);
}
process.stdout.write('No Tailwind canonical-class suggestions.\n');
