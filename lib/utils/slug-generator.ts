import { createClient } from '@/lib/supabase/server';

/**
 * Generate a random alphanumeric string
 * @param length - Length of the string to generate
 * @returns Random alphanumeric string
 */
function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique slug for an event
 * Checks database to ensure uniqueness
 * @returns Promise that resolves to a unique slug
 */
export async function generateUniqueSlug(): Promise<string> {
  const supabase = await createClient();
  let slug = '';
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate a random 8-character slug
    slug = generateRandomString(8);

    // Check if slug already exists
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // PGRST116 means no rows returned, so slug is unique
      isUnique = true;
    } else if (error) {
      // Some other error occurred
      throw new Error(`Failed to check slug uniqueness: ${error.message}`);
    }

    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique slug after multiple attempts');
  }

  return slug;
}
