import { serializeNewConcepts } from "$lib/features/concept-review/serializers"
import {
  getConceptsByIds,
  addConcepts,
  updatedCardReview,
  buildConceptCards,
} from "$lib/features/concept-review/functions"
import { normalizeConceptCards, normalizeReview } from "$lib/features/concept-review/normalizers"
import { reviewCard } from "$lib/features/concept-review/utilities"

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  let { newConcepts, deckId, card, conceptId, ...userResponse } = await request.json()
  const serializedConcepts = serializeNewConcepts(newConcepts)
  try {
    
    const { user } = await getSession()
    const conceptResponses = await addConcepts(supabase, {
      concepts: serializedConcepts,
      userId: user.id,
      deckId: deckId
    })

    if (conceptResponses.some(({ error }) => error)) {
      return new Response(JSON.stringify({ error: 'Error adding concepts' }), { status: 500 })
    }
    
    let createdCards = []

    const newConceptIds = conceptResponses.filter(({ data }) => data.isNewConcept).map(({ data }) => data.conceptId)

    if (newConceptIds.length > 0) {
      const { data: conceptsData, error: conceptsError } = await getConceptsByIds(supabase, { conceptIds: newConceptIds })

      if (conceptsError) {
        return new Response(JSON.stringify({ error: conceptsError }), { status: 500 })
      }

      const normalizedCards = normalizeConceptCards({ cards: conceptsData, deckId })

      const { data: cardsData, error: cardsError } = await buildConceptCards(supabase, {
        cards: normalizedCards,
        deckId: deckId,
        userId: user.id
      })

      if (cardsError) {
        return new Response(JSON.stringify({ error: cardsError }), { status: 500 })
      }
      
      createdCards = cardsData
    }
    
    const newReview = reviewCard({ card, review: userResponse })

    const { data: review, error: updateError } = await updatedCardReview(supabase, {
      userId: user.id,
      conceptId: conceptId,
      review: newReview
    })


    const normalizedReview = normalizeReview({ review })

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError, type: `updateError` }), { status: 500 })
    }

    return new Response(JSON.stringify({ review: normalizedReview, createdCards }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  } 
}