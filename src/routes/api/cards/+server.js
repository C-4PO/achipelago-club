import db from "$lib/db"

export const GET = async () => {
  const cards = await db.collection('cards').find().toArray()
  return new Response(JSON.stringify({ cards }), { status: 200 })
}

export const POST = async (request) => {
  const { card } = await request.json()
  await db.collection('cards').insertOne(card)
  return new Response(JSON.stringify({ card }), { status: 200 })
}
