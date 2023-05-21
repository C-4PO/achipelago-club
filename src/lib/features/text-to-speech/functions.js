import { TextToSpeechClient } from "@google-cloud/text-to-speech"
import {
  GOOGLE_CLOUD_TEXT_TO_SPEECH
} from '$env/static/private';

const client = new TextToSpeechClient({
  projectId: 'spanico',
  credentials: {
    private_key: GOOGLE_CLOUD_TEXT_TO_SPEECH,
    client_email: `chris@parkgate.io`
  }
});

export const speechToText = async({ text }) => {
  const request = {
    input: { text: text },
    voice: { languageCode: 'es-MX', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);

  console.log({ response })
}