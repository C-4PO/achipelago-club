import { getStories } from '$lib/features/story/functions.js';
import { redirect } from '@sveltejs/kit';
import { getDecks } from '$lib/features/story/functions.js'

export async function load({ parent }) {
  console.log('before')
  const { supabase, session } = await parent()
  console.log(session)
  if (!session) {
    throw redirect(303, '/');
  }
  console.log({ userId: session.user.id })
  const { data: decks, error: deckError } = await getDecks(supabase, { userId: session.user.id })

  if (deckError) {
    console.log(deckError)
    console.log(`deck error`)
    return { error: deckError }
  }

  const { data: stories, error } = await getStories(supabase, { userId: session.user.id })

  if (error) {
    console.log(`story error`)
    return { error }
  }

  console.log('called')

  return { stories, decks };
}