export async function saveWords({
  title,
  originalStory,
  translatedStory
}) {
  return fetch('/api/story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      originalStory,
      translatedStory,
    })
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  });
}