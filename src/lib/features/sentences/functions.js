export async function createSentences (supabase, {
  sentences,
}) {
  console.log(`before`)
  const { data: savedSentences, error: savedSentencesError } = await supabase
    .from('Sentences')
    .insert(sentences)
    .select()

  console.log(`after`)

  if (savedSentencesError) {
    return { error: savedSentencesError }
  }

  return { data: savedSentences }
}
