// Compares the keys of src/locales/en.json against src/locales/cs.json (the base).
// Reports keys missing in en.json, obsolete keys that exist only in en.json, and plural keys
// in cs.json that lack one of the Czech categories (`_one`, `_few`, `_other`).
// A plural key of cs.json (`years_one`, `years_few`, ...) is satisfied in en.json either by the
// key without the suffix (`years`) or by the English categories (`years_one` + `years_other`).
// Exits with 1 when anything is reported or a file cannot be read.
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const baseFile = join(root, 'src/locales/production/cs.json');
const targetFile = join(root, 'src/locales/production/en.json');

const pluralSuffix = /_(zero|one|two|few|many|other)$/;
const czechCategories = ['one', 'few', 'other'];
const englishCategories = ['one', 'other'];

function readLocale(file) {
    try {
        return JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
        process.stderr.write(`Cannot read ${relative(root, file)}: ${error.message}\n`);
        process.exit(1);
    }
}

function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Leaf keys as dot paths; arrays and scalars are leaves.
function collectKeys(value, prefix = '') {
    if (!isPlainObject(value)) {
        return prefix ? [prefix] : [];
    }
    return Object.entries(value).flatMap(([key, child]) =>
        collectKeys(child, prefix ? `${prefix}.${key}` : key),
    );
}

const baseKeys = collectKeys(readLocale(baseFile));
const targetKeys = new Set(collectKeys(readLocale(targetFile)));

const plainKeys = baseKeys.filter((key) => !pluralSuffix.test(key));
// Plural key without its suffix -> set of categories present in cs.json.
const pluralKeys = new Map();
for (const key of baseKeys.filter((key) => pluralSuffix.test(key))) {
    const pluralBase = key.replace(pluralSuffix, '');
    const category = key.match(pluralSuffix)[1];
    pluralKeys.set(pluralBase, (pluralKeys.get(pluralBase) ?? new Set()).add(category));
}

const incompletePlurals = [...pluralKeys].flatMap(([pluralBase, categories]) =>
    czechCategories
        .filter((category) => !categories.has(category))
        .map((category) => `${pluralBase}_${category}`),
);

const missing = plainKeys.filter((key) => !targetKeys.has(key));
const allowedKeys = new Set(plainKeys);
for (const pluralBase of pluralKeys.keys()) {
    const englishKeys = englishCategories.map((category) => `${pluralBase}_${category}`);
    allowedKeys.add(pluralBase);
    englishKeys.forEach((key) => allowedKeys.add(key));

    if (targetKeys.has(pluralBase)) {
        continue;
    }
    const presentEnglishKeys = englishKeys.filter((key) => targetKeys.has(key));
    if (presentEnglishKeys.length === 0) {
        missing.push(`${pluralBase} (or ${englishKeys.join(' + ')})`);
    } else {
        missing.push(...englishKeys.filter((key) => !targetKeys.has(key)));
    }
}
const obsolete = [...targetKeys].filter((key) => !allowedKeys.has(key));

function formatSection(title, keys) {
    return `${title} (${keys.length}):\n${keys.map((key) => `  - ${key}`).join('\n')}\n`;
}

const sections = [];
if (incompletePlurals.length > 0) {
    sections.push(formatSection('Missing plural categories in cs.json', incompletePlurals));
}
if (missing.length > 0) {
    sections.push(formatSection('Missing in en.json', missing));
}
if (obsolete.length > 0) {
    sections.push(formatSection('Obsolete in en.json (not in cs.json)', obsolete));
}

if (sections.length > 0) {
    process.stdout.write(sections.join('\n'));
    process.exit(1);
}
process.stdout.write(
    `en.json matches cs.json (plain keys: ${plainKeys.length}, plural keys: ${pluralKeys.size}).\n`,
);
