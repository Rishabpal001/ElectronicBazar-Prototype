import { isUuid } from './cart';

/** Read wishlist ids from stored JSON. Anything malformed is dropped (browser storage is user-editable). */
export function parseWishlist(raw: string | null): string[] {
  try {
    const data: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? Array.from(new Set(data.filter(isUuid))).slice(0, 100) : [];
  } catch { return []; }
}
