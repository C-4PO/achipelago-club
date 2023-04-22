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

async function addConcept(supabase, { concept, userId }) {
  try {
    // Check if the object with the same corresponding values already exists
    const { data: existingConcepts, error: existingConceptsError } = await supabase
      .from('Concepts')
      .select('id')
      .eq('words', concept.words)
      .eq('translation_words', concept.translation_words);

    if (existingConceptsError) {
      return { error: existingConceptsError }
    }

    let conceptId;

    // If the object doesn't exist, insert it
    if (existingConcepts.length === 0) {
      const { data: newConcept, error: insertError } = await supabase
        .from('Concepts')
        .insert([{ ...concept}]);

      if (insertError) {
        return { error: insertError }
      }

      console.log('Concept inserted:', newConcept);
      conceptId = newConcept[0].id;
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
      return { error: existingRelationError }
    }

    // If the relationship doesn't exist, insert it
    if (existingRelation.length === 0) {
      const { data: newRelation, error: insertRelationError } = await supabase
        .from('Concepts_Sentences')
        .insert([{ sentence_id: concept.sentence_id, concept_id: conceptId }]);

      if (insertRelationError) throw insertRelationError;

      console.log('Concepts_Sentences relation inserted:', newRelation);
    } else {
      console.log('Concepts_Sentences relation already exists:', existingRelation[0]);
    }
  } catch (error) {
    return {
      error,
    }
  }
}
