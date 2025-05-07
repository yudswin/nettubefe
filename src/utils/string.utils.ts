/**
 * Converts a string to a URL-friendly slug
 * @param text The string to convert to a slug
 * @returns A URL-friendly slug
 */
export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};