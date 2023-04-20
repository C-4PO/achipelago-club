export async function saveConcepts({
  concepts,
  deckId,
}) {
  return fetch('/api/concepts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      concepts,
      deckId,
    })
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  });
}