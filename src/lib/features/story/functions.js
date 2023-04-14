import { supabase } from '$lib/features/supabase/config.js'
import translator from '$lib/features/translate/config.js';

export  const translate = async({ text, from = "es", to ="en-US"}) => {
  const translationResult = await translator.translateText(text, from, to);
  return translationResult.text;
}

export const getStory = async ({ id }) => {
  if (!id) return { error: 'No id provided'}
  const { data: story, error, status } = await supabase
    .from('Story')
    .select('*, Sentences(*)')
    .eq('id', id)
    .limit(1)
    .single()

  return { story, error, status }
}

export const getStories = async () => {
  const { data: stories, error, status } = await supabase
    .from('Story')
    .select()
    .limit(100)
  return { stories, error, status }
}

export const saveStory = async ({
  story,
  sentences
}) => {
  const { data: savedStory, error, status } = await supabase
    .from('Story')
    .insert(story)
    .select()
    .limit(1)
    .single()
  
  if (!error) {
    const storyAssociatedSentences = sentences.map(sentence => {
      return {
        ...sentence,
        story_id: savedStory.id,
      }
    })

    const { data: savedSentences, error, status } = await supabase
      .from('Sentences')
      .insert(storyAssociatedSentences)
      .select()
    
    return { sentences: savedSentences, story: savedStory }
  }

  return { error, status }
}