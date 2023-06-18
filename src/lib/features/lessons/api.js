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