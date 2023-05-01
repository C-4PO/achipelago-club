import { Configuration, OpenAIApi } from 'openai';

import {
  OPENAI_API_KEY,
  OPENAI_ORG_KEY,
  } from '$env/static/private';

  const configuration = new Configuration({
    organization: OPENAI_ORG_KEY,
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  export default openai;