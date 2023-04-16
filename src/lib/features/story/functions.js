import translator from '$lib/features/translate/config.js';

export  const translate = async({ text, from = "es", to ="en-US"}) => {
  const translationResult = await translator.translateText(text, from, to);
  return translationResult.text;
}

export const getStory = async (supabase, { storyId, userId }) => {
  const { data, error, status } = await supabase
    .from('Users_Stories')
    .select(`*, Storys(*, Sentences(*))`)
    .eq('user_id', userId)
    .eq('story_id', storyId)
    .limit(1)
    .single()
  return { data, error, status }
}

export const getStories = async (supabase, { userId }) => {
  let { data, error, status } = await supabase
    .from('Users_Stories')
    .select(`*, Storys(*))`)
    .eq('user_id', userId)
    .limit(100)
  data = data.map(({ Storys }) => Storys)
  return { data, error, status }
}

export const getDecks = async (supabase, { userId }) => {
  const { data, error, status } = await supabase
    .from('Users_Decks')
    .select('*, Decks(*)')
    .eq('user_id', userId)
    .limit(100)
  return { data, error, status }
}

export const saveStory = async (supabase, {
  story,
  sentences,
  user_id,
}) => {
  const { data: savedStory, error: savedStoryError } = await supabase
    .from('Storys')
    .insert(story)
    .select()
    .limit(1)
    .single()
  
  if (savedStoryError) {
    return { error: savedStoryError }
  }

  const storyAssociatedSentences = sentences.map(sentence => {
    return {
      ...sentence,
      story_id: savedStory.id,
    }
  })

  const { data: savedSentences, error: savedSentencesError } = await supabase
    .from('Sentences')
    .insert(storyAssociatedSentences)
    .select()
    .limit(100)
  
  if (savedSentencesError) {
    return { error: savedSentencesError }
  }

  const { error: savedUsersStoriesError } = await supabase
    .from('Users_Stories')
    .insert({
      user_id: user_id,
      story_id: savedStory.id
    })
    .select()
    .limit(1)
    .single()

  if (savedUsersStoriesError) {
    return { error: savedUsersStoriesError }
  }
    
  return { sentences: savedSentences, story: savedStory }
}