import { TextToSpeechClient } from "@google-cloud/text-to-speech"
import { SpeechClient } from '@google-cloud/speech';
import { v2 } from '@google-cloud/translate';
import {
  GOOGLE_APPLICATION_CREDENTIALS_ENCODED
  } from '$env/static/private'



const credentials = JSON.parse(Buffer.from(GOOGLE_APPLICATION_CREDENTIALS_ENCODED, 'base64').toString());


const client = new TextToSpeechClient({ credentials });
const speechClient = new SpeechClient({ credentials });
const translateClient = new v2.Translate({ credentials });

export const textToSpeech = async({ text }) => {
  try {
    const request = {
      input: { text: text },
      voice: {
        languageCode: 'es-MX',
        ssmlGender: 'MALE',
      },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.65 },
    };
    const [ response ] = await client.synthesizeSpeech(request);

    return { data: response.audioContent }

  } catch (error) {
    return { error }
  }
}

// Helper function to convert file to base64

export const speechToText = async({ audioFile, audioType }) => {
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const audio = {
      content: buffer.toString('base64')
    };

    const config = {
      encoding: 'WEBM_OPUS_VORBIS',
      sampleRateHertz: 48000,
      languageCode: 'es-mx',
      enableWordConfidence: true,
    };

    const request = {
      config: config,
      audio: audio,
    };

    const [ response ] =  await speechClient.recognize(request);

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    const confidence = Math.max(response.results
      .map(result => parseFloat(result.alternatives[0].confidence)))

    return { data: { transcription, confidence  } }

  } catch (error) {
    console.error("Error in speechToText:", error);
    return { error };
  }
}

export const translate = async({ text = '', target = `en` }) => {
  try {
    const [translation] = await translateClient.translate(text, target);
    return { data: translation }
  } catch (error) {
    return { error }
  }
}



