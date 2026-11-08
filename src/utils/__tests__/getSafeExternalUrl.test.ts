import { getSafeExternalUrl } from '@/utils/getSafeExternalUrl';

describe('getSafeExternalUrl', () => {
    it('keeps http(s) urls', () => {
        expect(getSafeExternalUrl('https://example.com/a')).toBe('https://example.com/a');
        expect(getSafeExternalUrl('http://example.com')).toBe('http://example.com');
    });

    it('replaces [bracket] placeholders with a harmless fragment', () => {
        expect(getSafeExternalUrl('[https://company-1]')).toBe('#');
    });

    it('rejects other schemes', () => {
        expect(getSafeExternalUrl('javascript:alert(1)')).toBe('#');
    });
});
