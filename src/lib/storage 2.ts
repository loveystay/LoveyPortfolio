import { requireSupabase } from './supabase';

const bucket = 'portfolio-assets';

export async function uploadPortfolioAsset(file: File, folder = 'images'): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const client = requireSupabase();
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
