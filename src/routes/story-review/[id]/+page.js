import { getStory } from '$lib/features/story/functions.js';
import { normalizeStory } from '$lib/features/story/normalizers.js';
import { normalizeReviewCards } from '$lib/features/story-review/normalizers.js';

export async function load({ params, route }) {
  // const { stories, error } = await getStories()
  // return { stories, error };
  const { story } = await getStory({ id: params.id })

  const normalizedStory = normalizeStory(story)

  const cards = normalizeReviewCards({ story: normalizedStory })


  return { story: normalizedStory, cards };
}