import get from 'lodash/get.js';

export const generateStoryFromPrompt = async (openai, { prompt }) => {
  const messages = [
    { role: "system", 
      content: 
`You are a spanish story writter. Given a prompt provided by a user
of either a story description or notes from a spanish lession, you
will write a 500 word story. It must only be in the present tense
in the indicative moode in A1 level spanish. Response only in JSON
format with key story with the story string and the key title with the
title of the story; for example {story: '', title: ''}. If the story is
inappropriate return {error:'inappropriate'}`.replace(`\n`, ``),
    },
    {
      role: "user",
      content: prompt,
    }
  ]

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    
    const {
      story,
      title,
      error
    } = JSON.parse(response?.data?.choices?.[0]?.message.content);

    if (error) {
      return { error, type: 'generateStoryFromPrompt' }
    }

    return { data: { story, title } }
  } catch (error) {
    return { error, type: 'generateStoryFromPrompt' }
  }
}

