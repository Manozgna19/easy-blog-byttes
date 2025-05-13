
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_email?: string;
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  return { user: data?.user, error };
};

// Posts functions
export const getPosts = async () => {
  // Using type assertion to resolve TypeScript errors with Supabase types
  const { data, error } = await (supabaseClient
    .from('posts') as any)
    .select('*')
    .order('created_at', { ascending: false });
  
  return { posts: data as Post[] | null, error };
};

export const createPost = async (title: string, content: string, authorEmail: string) => {
  // Using type assertion to resolve TypeScript errors with Supabase types
  const { data, error } = await (supabaseClient
    .from('posts') as any)
    .insert([{ title, content, author_email: authorEmail }])
    .select();
  
  return { post: data?.[0] as Post | null, error };
};

// Use the supabase client directly when needed
export const supabase = supabaseClient;
