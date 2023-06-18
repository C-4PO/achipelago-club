export async function createCardsReviews(supabase, {
  cards,
  userId,
}) {
  const reviews = cards.map(card => {
    return {
      card_id: card.id,
      user_id: userId,
    }
  })

  const { data, error: errorCardReviews } = await supabase.from('Cards_Reviews')
    .insert(reviews)
    .select()

  if (errorCardReviews) {
    return { error: errorCardReviews, type: 'cardReviewsCreate' }
  }

  return { data }
}
