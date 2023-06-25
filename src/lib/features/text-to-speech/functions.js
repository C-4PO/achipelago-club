import { TextToSpeechClient } from "@google-cloud/text-to-speech"
import { SpeechClient } from '@google-cloud/speech';

const client = new TextToSpeechClient();
const speechClient = new SpeechClient();

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

    const [response] =  await speechClient.recognize(request);

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


