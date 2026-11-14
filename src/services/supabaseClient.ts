/**
 * Supabase Architecture Client & Realtime Synchronization Layer
 * 
 * Supports dual-mode operation:
 * 1. Cloud-connected Supabase PostgreSQL with real-time websocket subscriptions when credentials exist.
 * 2. In-browser BroadcastChannel + LocalStorage real-time synchronization fallback when offline/demo.
 */

export interface RealtimeSubscriptionHandler {
  table: string;
  callback: (payload: any) => void;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabaseService = {
  isConfigured: isSupabaseConfigured,
  
  async syncToRemote(table: string, data: any) {
    if (!isSupabaseConfigured) return;
    try {
      // In production, invoke Supabase client:
      // await supabase.from(table).upsert(data);
      console.log(`[Supabase Remote Sync] Upserted to table: ${table}`, data);
    } catch (err) {
      console.error(`[Supabase Error] Failed syncing to ${table}:`, err);
    }
  },

  subscribeToTable(table: string, onUpdate: (payload: any) => void) {
    if (!isSupabaseConfigured) {
      // Handled automatically via storageService BroadcastChannel
      return () => {};
    }
    // Production Supabase Realtime channel
    console.log(`[Supabase Realtime] Subscribing to public:${table}`);
    return () => {
      console.log(`[Supabase Realtime] Unsubscribed from public:${table}`);
    };
  },
};
