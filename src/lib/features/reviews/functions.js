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

// create a Cards_Reviews record given a card id, user id, review type and review
export async function updateCardReview(supabase, {
  review,
  cardId,
  userId,
  type,
}) {
  const { data: existingReviews, error: errorExistingReview } = await supabase.from('Cards_Reviews')
    .select()
    .eq('card_id', cardId)
    .eq('user_id', userId)
    .eq('type', type)

  if (errorExistingReview) {
    return { error: errorExistingReview, type: 'cardReviewCreate' }
  }

  if (existingReviews.length) {
    const existingReview = existingReviews[0]
    // update existing review
    const { data: updatedReview, error: errorUpdatedReview } = await supabase.from('Cards_Reviews')
      .update({
        ...review,
      })
      .eq('id', existingReview.id)
      .select()
      .single()

    if (errorUpdatedReview) {
      return { error: errorUpdatedReview, type: 'cardReviewCreate' }
    }

    return { data: updatedReview }
  }

  const { data: newReview, error: errorNewReview } = await supabase.from('Cards_Reviews')
    .insert({
      ...review,
      card_id: cardId,
      user_id: userId,
      type,
    })
    .select()
    .single()
    
  return { data: newReview }
}
