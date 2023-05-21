export async function createSentenceCards(supabase, {
  sentences,
  deckId,
}) {
  const sentenceCards = sentences.map((sentence, index) => {
    return {
      sentence_id: sentence.id,
      deck_id: deckId,
      type: 'SENTENCE',
      order_index: index,
    }
  })

  const { data: savedSentenceCards, error: savedSentenceCardsError } = await supabase
    .from('Cards')
    .insert(sentenceCards)
    .select()

  if (savedSentenceCardsError) {
    return { error: savedSentenceCardsError }
  }

  return { data: savedSentenceCards }
}

