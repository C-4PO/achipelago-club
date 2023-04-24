import {
  normalizeRelatedConceptsInConceptCards,
  normalizeReviewInConceptCards
} from '$lib/features/concept-review/normalizers'

export function getDeck(supabase, { deckId, userId }) {
  return supabase
    .from('Users_Decks')
    .select("Decks(*, Concepts_Decks(*, Concepts(*, Concepts_Sentences(*, Sentences(*)))))")
    .eq('user_id', userId)
    .eq('deck_id', deckId)
    .single()
}

export function getConceptsBySentenceIds(supabase, { userId, sentenceIds }) {
  return supabase
    .from('Concepts_Sentences')
    .select()
    .eq('user_id', userId)
    .in('sentence_id', sentenceIds)
}

export function getConceptsByIds(supabase, { conceptIds }) {
  return supabase
    .from('Concepts')
    .select('*, Concepts_Sentences(*, Sentences(*)))')
    .in('id', conceptIds)
}

export function getReviews(supabase, { deckId }) {
  return supabase
    .from('Concepts_Decks')
    .select('* , Concepts(*, Concepts_Reviews(*))')
    .eq('deck_id', deckId)
}

export async function buildConceptCards(supabase, { cards, deckId, userId }) {
  const { data: relatedConceptData = {}, error: relatedConceptError } = await getConceptsBySentenceIds(supabase, {
    userId: userId,
    sentenceIds: cards.map(card => card.sentenceId),
  })

  if (relatedConceptError) {
    console.error(relatedConceptError)
    return { error: relatedConceptError, type: `relatedConceptError`}
  }

  cards = normalizeRelatedConceptsInConceptCards({ cards, relatedConceptData })

  const { data: reviewData = {}, error: reviewError } = await getReviews(supabase, { deckId })

  if (reviewError) {
    console.error(reviewError)
    return { error: reviewError }
  }

  cards = normalizeReviewInConceptCards({ cards, reviewData })

  return { data: cards }
}

export async function addConcepts(supabase, { concepts, userId, deckId }) {
  return Promise.all(concepts.map((concept) => addConcept(supabase, { concept, userId, deckId })));
}

async function addConcept(supabase, { concept, userId, deckId }) {
  const { data: existingConcepts, error: existingConceptsError } = await supabase
    .from('Concepts')
    .select()
    .contains('words', concept.words)
    .contains('translation_words', concept.translation_words)
  
  if (existingConceptsError) {
    return { error: existingConceptsError, type: `existingConceptsError`};
  }

  let conceptId;
  let isNewConcept = false;
  // If the object doesn't exist, insert it
  if (existingConcepts.length === 0 ||
    existingConcepts[0].words.length !== concept.words.length ||
    existingConcepts[0].translation_words.length !== concept.translation_words.length
  ) {

    const { data: newConcept, error: insertError } = await supabase
      .from('Concepts')
      .insert({ 
        words: concept.words,
        translation_words: concept.translation_words,
      }).select().limit(1).single();

    if (insertError) {
      return { error: insertError, type: 'insertError' };
    }

    console.log('Concept inserted:', newConcept)
    conceptId = newConcept.id;
    
    isNewConcept = true;
  } else {
    console.log('Concept already exists:', existingConcepts[0]);
    conceptId = existingConcepts[0].id;
  }

  // Check if the relationship exists in the Concepts_Sentences table
  const { data: existingRelation, error: existingRelationError } = await supabase
    .from('Concepts_Sentences')
    .select('*')
    .eq('sentence_id', concept.sentence_id)
    .eq('concept_id', conceptId);

  if (existingRelationError) {
    return { error: existingRelationError, type: 'existingRelationError' };
  }

  // If the relationship doesn't exist, insert it
  if (existingRelation.length === 0) {
    const { data: newRelation, error: insertRelationError } = await supabase
      .from('Concepts_Sentences')
      .insert({
        sentence_id: concept.sentence_id,
        concept_id: conceptId,
        display_words: concept.display_words,
        display_words_indexes: concept.display_words_indexes,
        display_translation_words: concept.display_translation_words,
        display_translation_words_indexes: concept.display_translation_words_indexes,
        user_id: userId,
      });

    if (insertRelationError) {
      return { error: insertRelationError, type: 'concepr sentences' };
    }

    console.log('Concepts_Sentences relation inserted:', newRelation);
  } else {
    console.log('Concepts_Sentences relation already exists:', existingRelation[0]);
  }

  // If a new concept was created, insert the relation in the Concepts_Decks table
  if (isNewConcept) {
    const { error: insertDeckRelationError } = await supabase
      .from('Concepts_Decks')
      .insert({
        concept_id: conceptId,
        deck_id: deckId,
      });

    if (insertDeckRelationError) {
      return { error: insertDeckRelationError, type: 'concepts decks' };
    }
    const { data: newConceptReview, error: insertConceptReviewError } = await supabase
      .from('Concepts_Reviews')
      .insert({
        concept_id: conceptId,
        user_id: userId,
      });

    if (insertConceptReviewError) {
      return { error: insertConceptReviewError };
    }

    console.log('Concepts_Reviews row inserted:', newConceptReview);
  }

  return { data: { conceptId, isNewConcept } };
}

export const updatedCardReview = async (supabase, { userId, conceptId, review }) => {
  const { data, error } = await supabase
    .from('Concepts_Reviews')
    .update({
      ...review,
    })
    .select()
    .eq('user_id', userId)
    .eq('concept_id', conceptId)
    .single();

  if (error) {
    return { error, type: 'updateCard.update' };
  }

  return { data };

}