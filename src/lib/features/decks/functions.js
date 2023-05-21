async function insertDeck (supabase, {
  title,
  type,
  isPersonal,
}) {
  const { data, error, status } = await supabase.from('Decks')
    .insert({
      title,
      type,
      is_personal: isPersonal,
    })
    .select()
    .limit(1)
    .single()
  return { data, error, status }
}

async function insertUserDeck(supabase, { userId, deckId }) {
  const { data, error } = await supabase.from('Users_Decks').insert({
    deck_id: deckId,
    user_id: userId,
  }).select()
  .limit(1)
  .single()

  return { data, error }
}

export async function createDeck(supabase, {
  title,
  type,
  isPersonal,
  userId,
}) {
  const { data: savedDeck, error: savedDeckError } = await insertDeck(supabase, {
    title,
    type,
    isPersonal,
  })

  if (savedDeckError) {
    return { error: savedDeckError, type: 'savedDeckError' }
  }

  const { error: savedUserDeckError } = await insertUserDeck(supabase, {
    userId,
    deckId: savedDeck.id,
  })

  if (savedUserDeckError) {
    return { error: savedUserDeckError, type: 'savedUserDeckError' }
  }

  return { data: savedDeck }
}

export async function associateCardsToDeck(supabase, {
  cards,
  deckId,
}) {
  const { data, error: cardsDecksError } = await supabase.from('Decks_Cards')
    .insert(cards.map(card => ({
      card_id: card.id,
      deck_id: deckId,
    })))
    .select()

  if (cardsDecksError) {
    return { error: cardsDecksError, type: 'cardsDecksError' }
  }

  return { data }
}

export async function getDecks(supabase, {
  userId,
}) {
  const { data, error } = await supabase.from('Users_Decks')
    .select('Decks(*, Decks_Cards(Cards(*, Cards_Reviews(*))))')
    .eq('user_id', userId)

  return { data, error }
}

export async function getStoryDeck(supabase, {
  deckId,
}) {
  const { data, error } = await supabase.from('Decks')
    .select('*, Decks_Cards(Cards(*, Sentences(*, Concepts_Sentences(*, Concepts(*))), Cards_Reviews(*)))')
    .eq('id', deckId)
    .single()

  return { data, error }
}