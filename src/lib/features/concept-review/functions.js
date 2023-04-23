export function getDeck(supabase, { deckId, userId }) {
  return supabase
    .from('Users_Decks')
    .select("Decks(*, Concepts_Decks(*, Concepts(*, Concepts_Sentences(*, Sentences(*)))))")
    .eq('user_id', userId)
    .eq('deck_id', deckId)
    .single()
}

export function getDeckConcepts(supabase, { userId, sentenceIds }) {
  return supabase
    .from('Concepts_Sentences')
    .select()
    .eq('user_id', userId)
    .in('sentence_id', sentenceIds)
}

export function getReviews(supabase, { deckId }) {
  return supabase
    .from('Concepts_Decks')
    .select('* , Concepts(*, Concepts_Reviews(*))')
    .eq('deck_id', deckId)
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
    return { error: existingConceptsError, type: 'query' };
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
      return { error: insertError, type: 'insert' };
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
    return { error: existingRelationError, type: 'concepts sentences' };
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
      });

    if (insertConceptReviewError) {
      return { error: insertConceptReviewError };
    }

    console.log('Concepts_Reviews row inserted:', newConceptReview);
  }

  return { data: { conceptId, isNewConcept } };
}

// export evaluateCard = async (supabase, { userId, cardId, review }) => {




//   const { data: existingReview, error: existingReviewError } = await supabase
//     .from('Reviews')
//     .select()
//     .eq('user_id', userId)
//     .eq('card_id', cardId)
//     .single();

//   if (existingReviewError) {
//     return { error: existingReviewError, type: 'query' };
//   }

//   // If the review doesn't exist, insert it
//   if (existingReview === null) {
//     const { data: newReview, error: insertError } = await supabase
//       .from('Reviews')
//       .insert({
//         user_id: userId,
//         card_id: cardId,
//         review,
//       });

//     if (insertError) {
//       return { error: insertError, type: 'insert' };
//     }

//     console.log('Review inserted:', newReview);
//   } else {
//     console.log('Review already exists:', existingReview);
//   }

//   return { data: { } };

// }