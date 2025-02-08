import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Social features will be disabled.'
  );
}

console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL);

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function getComments(productId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function postComment(productId, userId, text) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        product_id: productId,
        user_id: userId,
        text: text,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data;
}

export async function getLikesCount(productId) {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: false })
    .eq('product_id', productId);
  if (error) throw error;
  return count;
}

export async function userHasLiked(productId, userId) {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function toggleLike(productId, userId) {
  if (!supabase) return 'unavailable';

  try {
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      const { error: delError } = await supabase
        .from('likes')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', userId);

      if (delError) throw delError;
      return 'unliked';
    } else {
      const { error: insError } = await supabase.from('likes').insert([
        {
          product_id: productId,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insError) throw insError;
      return 'liked';
    }
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}
