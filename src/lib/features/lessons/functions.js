// import { speechToText } from '$lib/features/text-to-speech/functions.js'



// let getLessonCardData = async ({ card, sides }) => {
//   for (const side of sides) {
//     if (side.type === `ReadListen` && !card.sentenceAudio) {
//       // const response = await speechToText({ text: card.sentence })

//       // console.log(response)
//       card.sentenceAudio = 'https://www.oxfordlearnersdictionaries.com/media/english/us_pron/a/ame/ameri/american__gb_1.mp3'
//     }
//   }
// }


export let generateLesson = async ({ sides,  deck} ) => {
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
      sides,
    })),
  ]

  console.log({ lesson })

  return lesson
}
