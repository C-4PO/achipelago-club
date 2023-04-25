export async function saveConcepts({
  ...reviewItem
}) {
  return fetch('/api/concepts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewItem)
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  });
}