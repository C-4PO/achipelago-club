import { getStories } from '$lib/features/story/functions.js';

export async function load({ params }) {
  const { stories, error } = await getStories()
  return { stories, error };
}