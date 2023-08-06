import { speechToText } from "$lib/features/text-to-speech/functions"
import { getCardByCardId } from "$lib/features/cards/functions"
import { gradeCard } from "$lib/features/lessons/utilities"
import { normalizeSentenceCards } from "$lib/features/cards/normalizers"
import { reviewCard } from "$lib/features/reviews/utilities"
import { updateCardReview } from "$lib/features/reviews/functions"

export const POST = async ({ request, locals: { supabase, getSession }}) => {
  const session = await getSession()
  const { user } = session || {}

  const { file: audioFile, audioType, cardId  } = Object.fromEntries(await request.formData())

  try {
    if (!user) {
      console.error(`You must be logged in to create a story.`)
      return new Response(JSON.stringify({ error: `You must be logged in to create a story.` }), { status: 401 })
    }

    const { data: { transcription, confidence } = {}, error } = await speechToText({ audioFile, audioType })

    if (error) {
      console.error(`error`, error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    const { data: card, error: cardError } = await getCardByCardId(supabase, { cardId })

    if (cardError) {
      console.error(`cardError`, cardError)
      return new Response(JSON.stringify({ error: cardError }), { status: 500 })
    }

    const sentenceCard = normalizeSentenceCards({ card })

    const { data: {
      grade: cardGrade,
      score,
      totalScore,
      inputWordDetails,
      referenceWordDetails
    }, error: cardGradeError } = gradeCard({
      sentence: sentenceCard.sentence,
      inputText: transcription,
      confidence,
    })

    if (cardGradeError) {
      return new Response(JSON.stringify({ error: cardGradeError }), { status: 500 })
    }

    const review =  sentenceCard.reviews ? sentenceCard.reviews.find(({ type }) => type === 'SPEAK') : null
    const { data: newReview } = reviewCard({ grade: cardGrade, review, type: 'SPEAK' })
    const { data: updatedReview, error: updatedReviewError } = await updateCardReview(supabase, {
      review: newReview,
      cardId,
      userId: user.id,
      type: 'SPEAK',
    })

    if (updatedReviewError) {
      return new Response(JSON.stringify({ error: updatedReviewError }), { status: 500 })
    }

    return new Response(JSON.stringify(
      {
        review: updatedReview,
        grade: cardGrade,
        score,
        totalScore,
        inputWordDetails,
        referenceWordDetails,
        cardId,
        confidence,
      }
    ), { status: 200 })
  } catch (error) {
    console.error(`error`, error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
