import { speechToText } from "$lib/features/text-to-speech/functions"

export const POST = async ({ request, locals: { supabase, getSession }}) => {
  const session = await getSession()
  const { user } = session || {}

  const { file: audioFile, audioType, ...rest  } = Object.fromEntries(await request.formData())

  try {
    if (!user) {
      console.error(`You must be logged in to create a story.`)
      return new Response(JSON.stringify({ error: `You must be logged in to create a story.` }), { status: 401 })
    }

    const { data, error } = await speechToText({ audioFile, audioType })

    if (error) {
      console.error(`error`, error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (error) {
    console.error(`error`, error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
