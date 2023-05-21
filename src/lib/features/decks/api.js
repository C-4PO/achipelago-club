export async function postSentenceDeck({
  title,
  originalStory
}) {
  return fetch('/api/stories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      originalStory,
    })
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  });
}
