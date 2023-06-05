import { speechToText } from '$lib/features/text-to-speech/functions.js'

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession()
  const { user } = session || {}

  let {
    text
  } = await request.json()

  const { data: audioBuffer, error } = await speechToText({ text })

  const headers = {
    'Content-Type': 'audio/mp3',
  };

  return new Response(audioBuffer, { headers });

}