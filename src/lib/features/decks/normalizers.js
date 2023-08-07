import { summerizeReviews } from '$lib/features/reviews/normalizers'
import { normalizeSentenceCards } from '$lib/features/cards/normalizers'

export const normalizeShallowDeck = ({ decks }) => {
  return {
    data: 
      decks.map(({ Decks: {
        id,
        title,
        type,
        is_personal,
        Decks_Cards,
      }}) => {
        return {
          id,
          title,
          type,
          isPersonal: is_personal,
          reviewSummary: summerizeReviews({
            reviews: Decks_Cards.reduce(( reviews, { Cards }) => {
              return [ ...reviews, ...Cards.Cards_Reviews ]
            }, []),
            cards: Decks_Cards.map(({ Cards }) => Cards),
          })
        }
      }
    ),
    error: null,
  }
}

export const normalizeStoryDeck = ({ dbStoryDeck }) => {
  try {
    const {
      id,
      title,
      Decks_Cards,
    } = dbStoryDeck
    
    const cards = Decks_Cards.map(({ Cards: card }) => {
      return normalizeSentenceCards({ card })
    })
    
    const data = {
      id,
      title,
      cards,
    }

    return { data }
  } catch (error) {
    return { error }
  }
}
