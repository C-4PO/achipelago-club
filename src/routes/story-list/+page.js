import { getStories } from '$lib/features/story/functions.js';
import { redirect } from '@sveltejs/kit';
import { getDecks } from '$lib/features/story/functions.js'

export async function load({ parent }) {
  const { supabase, session } = await parent()

  if (!session) {
    throw redirect(303, '/');
  }

  const { data: decks, error: deckError } = await getDecks(supabase, { userId: session.user.id })

  if (deckError) {
    return { error: deckError }
  }

  const { data: stories, error } = await getStories(supabase, { userId: session.user.id })

  if (error) {
    return { error }
  }

  return { stories, decks };
}