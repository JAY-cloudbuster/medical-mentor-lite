/**
 * Utility functions for advanced text processing
 */

export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const extractKeywords = (text) => {
    const commonWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or'];
    return text.split(' ').filter(word => !commonWords.includes(word.toLowerCase()));
};
