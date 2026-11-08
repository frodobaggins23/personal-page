/**
 * Content urls may still be `[https://placeholder]` before go-live. Those must not become
 * relative links (they would navigate inside the SPA), so anything that is not http(s) is "#".
 */
export function getSafeExternalUrl(url: string): string {
    return /^https?:\/\//i.test(url) ? url : '#';
}
