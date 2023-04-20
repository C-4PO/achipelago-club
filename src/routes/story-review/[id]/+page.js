import { getStory } from '$lib/features/story/functions.js';
import { normalizeStory } from '$lib/features/story/normalizers.js';
import { normalizeSentenceCards } from '$lib/features/story-review/normalizers.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
  const { supabase, session } = await parent()

  if (!session) {
    throw redirect(303, '/')
  }

  const user = session.user
  const { data = {}, error } = await getStory(supabase, { storyId: params.id, userId: user.id })

  if (error) {
    console.error(error)
    return { error }
  }

  const normalizedStory = normalizeStory(data)
  const cards = normalizeSentenceCards({ story: normalizedStory })
  
  return { cards };
}