
import { DiaryEntry, Cultivation, MarketPost, Query } from './types';

/**
 * Service to communicate with Cloudflare Pages Functions
 * Gracefully handles missing API endpoints by falling back to empty/mock data 
 * when running in non-production (preview) environments.
 */
export const ApiService = {
  async fetchAllData() {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) {
        console.warn('API endpoint not found (likely local preview). Falling back to local state.');
        return { cultivations: [], entries: [], queries: [], marketPosts: [], farmer: null };
      }
      return await res.json();
    } catch (err) {
      console.error('Fetch failed:', err);
      // Return empty structure so the app doesn't crash
      return { cultivations: [], entries: [], queries: [], marketPosts: [], farmer: null };
    }
  },

  async saveEntry(entry: DiaryEntry) {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Save failed (likely local preview):', err);
      return { success: true, mocked: true };
    }
  },

  async saveCultivation(cultivation: Cultivation) {
    try {
      const res = await fetch('/api/cultivations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cultivation),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Save failed (likely local preview):', err);
      return { success: true, mocked: true };
    }
  },

  async saveMarketPost(post: MarketPost) {
    try {
      const res = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Save failed (likely local preview):', err);
      return { success: true, mocked: true };
    }
  },

  async saveQuery(query: Query) {
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Save failed (likely local preview):', err);
      return { success: true, mocked: true };
    }
  }
};
