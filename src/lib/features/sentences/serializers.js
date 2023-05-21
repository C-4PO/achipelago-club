import flatten from 'lodash/flatten.js'

export function serializeSentences({ originalStory, translatedStory }) {
  const [
    originalStorySentences,
    translatedStorySentences
  ] = [originalStory, translatedStory].map(text => serializeText({ text }))

  const normalizedSentences = originalStorySentences.map((sentence, index) => {
    return {
      index,
      paragraph: sentence.paragraph,
      sentence: sentence.sentence,
      display_sentence: sentence.displaySentence,
      translation: translatedStorySentences[index].sentence,
      display_translation: translatedStorySentences[index].displaySentence,
      words: sentence.words.map(word => word.word),
      translation_words: translatedStorySentences[index].words.map(word => word.word),
      translation_display_words: translatedStorySentences[index].words.map(word => word.displayWord),
      display_words: sentence.words.map(word => word.displayWord),
      is_question: sentence.isQuestion,
      is_exclamation: sentence.isExclamation,
    }
  });

  return { data: normalizedSentences }
}

export function serializeText({ text }) {
  const paragraphs = getParagraphs({ text })
  const sentences = getSentances({ paragraphs })
  return sentences
}

function cleanText ({ text }) {
  let cleanedText = "";
  text = text.toLowerCase();

  for (let j = 0; j < text.length; j++) {
    let character = text.charAt(j);

    if (character.match(/[aábcdeéfghiíjklmnñoópqrstuúüvwxyz0-9\ ]/i)) {
      cleanedText += character;
    }
  }

  return cleanedText;
}

function tokenizeWords({ sentence }) {
  let tokens = [];
  let words = sentence.split(" ");

  for (let i = 0; i < words.length; i++) {
    let displayWord = words[i];
    let word = cleanText({ text: words[i] })

    if (word !== "") {
      tokens.push({
        displayWord,
        word,
      });
    }
  }
  return tokens;
}

function splitPargaraph({ paragraph }) {
  return paragraph.match( /[^\.!\?]+[\.!\?]+/g );
} 

function getParagraphs({ text }) {
  return text.split('\n').map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0)
}

function getSentances({ paragraphs }) {
  return flatten(paragraphs.map((paragraph, index) => splitPargaraph({ paragraph }).map(sentence => sentence.trim()).filter(sentence => sentence.length > 0).map((sentence => {
    return {
      displaySentence: sentence,
      sentence: sentence.toLowerCase(),
      words: tokenizeWords({ sentence }),
      paragraph: index,
      isQuestion: sentence.endsWith('?'),
      isExclamation: sentence.endsWith('!'),
    }
  }))));
}