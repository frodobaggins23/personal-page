const START_DATE_PATTERN = /^(0[1-9]|1[0-2])-(\d{4})$/;

/**
 * Counts full years elapsed since `startDate` ("mm-yyyy"), month-aware.
 * `now` is a parameter so callers (and tests) own the clock.
 */
export function calculateYearsOfPraxis(startDate: string, now: Date): number {
    const match = START_DATE_PATTERN.exec(startDate);
    if (!match) {
        throw new Error(`Invalid start date "${startDate}", expected the mm-yyyy format.`);
    }

    const startMonth = Number(match[1]);
    const startYear = Number(match[2]);
    const elapsedMonths = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);

    if (elapsedMonths < 0) {
        throw new Error(`Start date "${startDate}" is in the future.`);
    }

    return Math.floor(elapsedMonths / 12);
}
