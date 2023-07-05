// import { speechToText } from '$lib/features/text-to-speech/functions.js'

import { getSidesFromReviews } from '$lib/features/lessons/utilities.js'


// let getLessonCardData = async ({ card, sides }) => {
//   for (const side of sides) {
//     if (side.type === `ReadListen` && !card.sentenceAudio) {
//       // const response = await speechToText({ text: card.sentence })

//       // console.log(response)
//       card.sentenceAudio = 'https://www.oxfordlearnersdictionaries.com/media/english/us_pron/a/ame/ameri/american__gb_1.mp3'
//     }
//   }
// }


export let generateLesson = async ({ deck} ) => {
  const {
    id,
    title,
    cards
  } = deck;

  const lesson = [
    ...cards.map((card) => ({
      cardId: card.id,
      stage: `read`,
      gradeWeight: 1,
      sides: getSidesFromReviews({ reviews: card.reviews })
    })).filter(({ sides }) => sides.length > 0)
  ]

  console.log({ lesson })

  return lesson
}
