import { getStory } from '$lib/features/story/functions.js';
import { normalizeStory } from '$lib/features/story/normalizers.js';
import { normalizeReviewCards } from '$lib/features/story-review/normalizers.js';

export async function load({ params, route, parent }) {
  const { supabase, session } = await parent()
  const user = session.user
  const { data: { Storys } = {}, error } = await getStory(supabase, { storyId: params.id, userId: user.id })

  if (error) {
    return { error }
  }

  const normalizedStory = normalizeStory(Storys)
  const cards = normalizeReviewCards({ story: normalizedStory })
  
  return { cards };
}