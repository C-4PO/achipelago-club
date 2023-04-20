export function getDeck(supabase, { deckId, userId }) {
  return supabase
    .from('Users_Decks')
    .select("Decks(*, Concepts_Decks(*, Concepts(*, Concepts_Sentences(*, Sentences(*)))))")
    .eq('deck_id', deckId)
    .single()
}