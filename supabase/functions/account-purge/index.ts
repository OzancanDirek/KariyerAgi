import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type QueueItem = { talep_id: string; kullanici_id: string | null; durum: 'bekliyor' | 'veri_silindi' };
type StoredFile = { depolama_alani: string; depolama_yolu: string };

const url = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const cronSecret = Deno.env.get('PURGE_CRON_SECRET');

function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(name + ' is not configured');
  return value;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST' || !cronSecret || request.headers.get('x-cron-secret') !== cronSecret) {
    return new Response('Forbidden', { status: 403 });
  }

  const client = createClient(required(url, 'SUPABASE_URL'), required(serviceKey, 'SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: queue, error: queueError } = await client.rpc('hesap_imha_kuyrugu');
  if (queueError) return Response.json({ error: queueError.message }, { status: 500 });

  const completed: string[] = [];
  const failed: Array<{ requestId: string; message: string }> = [];
  for (const item of (queue ?? []) as QueueItem[]) {
    try {
      if (item.durum === 'bekliyor') {
        const { data, error } = await client.rpc('hesap_imha_dosyalari', { p_talep_id: item.talep_id });
        if (error) throw error;
        const files = (data ?? []) as StoredFile[];
        const buckets = new Map<string, string[]>();
        for (const file of files) {
          const names = buckets.get(file.depolama_alani) ?? [];
          names.push(file.depolama_yolu);
          buckets.set(file.depolama_alani, names);
        }
        for (const [bucket, names] of buckets) {
          for (let index = 0; index < names.length; index += 100) {
            const { error: removeError } = await client.storage.from(bucket).remove(names.slice(index, index + 100));
            if (removeError) throw removeError;
          }
        }
        const { error: databaseError } = await client.rpc('hesap_imha_veritabani', {
          p_talep_id: item.talep_id,
          p_silinen_dosya_sayisi: files.length,
        });
        if (databaseError) throw databaseError;
      }

      const { error: authError } = await client.rpc('hesap_imha_auth', { p_talep_id: item.talep_id });
      if (authError) throw authError;
      const { error: completeError } = await client.rpc('hesap_imha_tamamla', { p_talep_id: item.talep_id });
      if (completeError) throw completeError;
      completed.push(item.talep_id);
    } catch (error) {
      failed.push({ requestId: item.talep_id, message: error instanceof Error ? error.message : JSON.stringify(error) });
    }
  }
  return Response.json({ completed, failed }, { status: failed.length ? 500 : 200 });
});
