
import { DiaryEntry, Cultivation, MarketPost, Query } from './types';

export const ApiService = {
  async fetchAllData() {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return { cultivations: [], entries: [], queries: [], marketPosts: [], farmer: null, regions: [], locations: [], cascades: [], villages: [] };
      return await res.json();
    } catch (err) {
      console.error('Fetch failed:', err);
      return { cultivations: [], entries: [], queries: [], marketPosts: [], farmer: null, regions: [], locations: [], cascades: [], villages: [] };
    }
  },

  async saveMasterData(type: string, data: any) {
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, action: 'SAVE' }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Master save failed:', err);
      return { success: false };
    }
  },

  async deleteMasterData(type: string, id: string) {
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action: 'DELETE' }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Master delete failed:', err);
      return { success: false };
    }
  },

  async saveEntry(entry: DiaryEntry) {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return await res.json();
    } catch (err) {
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
      return await res.json();
    } catch (err) {
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
      return await res.json();
    } catch (err) {
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
      return await res.json();
    } catch (err) {
      return { success: true, mocked: true };
    }
  }
};
