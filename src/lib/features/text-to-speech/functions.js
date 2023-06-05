import { TextToSpeechClient } from "@google-cloud/text-to-speech"

const client = new TextToSpeechClient();

export const speechToText = async({ text }) => {
  try {
    const request = {
      input: { text: text },
      voice: {
        languageCode: 'es-MX',
        ssmlGender: 'MALE',
      },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.65, },
    };
    const [ response ] = await client.synthesizeSpeech(request);

    return { data: response.audioContent }

  } catch (error) {
    return { error }
  }
}