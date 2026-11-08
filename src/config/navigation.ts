export type NavigationItemId = 'experience' | 'projects' | 'about' | 'contact';

/** Section ids on the main page, in menu order. Numbering (01, 02, ...) is derived from the index. */
export const navigationItems: readonly NavigationItemId[] = [
    'experience',
    'projects',
    'about',
    'contact',
];

export function formatNavigationIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
}
