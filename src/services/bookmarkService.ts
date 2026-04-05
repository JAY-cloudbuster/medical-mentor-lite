const STORAGE_KEY = "medterm-bookmarks";

export function getBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(termId: string): boolean {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(termId);
  if (index > -1) {
    bookmarks.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push(termId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  }
}

export function isBookmarked(termId: string): boolean {
  return getBookmarks().includes(termId);
}
