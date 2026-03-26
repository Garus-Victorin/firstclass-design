import { supabase } from './supabase';
import { Product, Category } from './types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

export const WHATSAPP_NUMBER = '96422780';
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/AQFAXPkYuQFZWzng7';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('lebele');
  
  if (error) throw error;
  return data || [];
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('category_ids', [categoryId])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getActiveReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

