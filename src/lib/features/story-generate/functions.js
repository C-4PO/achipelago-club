import get from 'lodash/get';

export const generateStoryFromPrompt = async (openai, { prompt }) => {
  const messages = [
    { role: "system", 
      content: 
`You are a spanish story writter. Given a prompt provided by a user
of either a story description or notes from a spanish lession, you
will write a 500 word story. The must only be in the present tense
in the indicative moode in A1 level spanish. Response only in JSON
format with key data with the story string. If the story is
inappropriate return 'inappropriate'`.replace(`\n`, ``),
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
    
    const data = response?.data?.choices?.[0]?.message.content;
    return JSON.parse(data)
  } catch (error) {
    console.log({ error })
    return { error, type: 'generateStoryFromPrompt' }
  }
}

