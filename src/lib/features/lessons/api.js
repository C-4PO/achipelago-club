import { debug } from "svelte/internal";
import { singleFileUpload } from "../utilities";

export const gradeCardSpeak = async ({ audioFile, audioType, cardId }) => {
  return singleFileUpload({
    url: '/api/review-listen',
    file: audioFile,
    additionalData: {
      audioType,
      cardId,
    }
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  })
}

export const gradeCardWrite = async ({ text, cardId }) => {
  return fetch(`/api/review-write`, {
    method: `POST`,
    body: JSON.stringify({
      text,
      cardId,
    }),
    headers: {
      'Content-Type': `application/json`
    }
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  })
}

