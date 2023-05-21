import { dictionary } from '$lib/dictionaries/dictionary'
import { verbs } from '$lib/dictionaries/verb-conjugation'
import flatten from 'lodash/flatten.js'

export function processStory({ story }) {
  const paragraphs = getParagraphs(story)
  const sentences = getSentances(paragraphs)
  return sentences
}

export function cleanSentence (sentence) {
  let cleanedSentence = "";
  sentence = sentence.toLowerCase();

  for (let j = 0; j < sentence.length; j++) {
    let character = sentence.charAt(j);

    if (character.match(/[aábcdeéfghiíjklmnñoópqrstuúüvwxyz0-9\ ]/i)) {
      cleanedSentence += character;
    }
  }

  return cleanedSentence;
}

function tokenizeWords(sentence) {
  let tokens = [];
  let words = sentence.split(" ");

  for (let i = 0; i < words.length; i++) {
    let displayWord = words[i];
    let word = words[i].toLowerCase();
    
    let cleanedWord = "";

    for (let j = 0; j < word.length; j++) {
      let character = word.charAt(j);

      if (character.match(/[aábcdeéfghiíjklmnñoópqrstuúüvwxyz0-9]/i)) {
        cleanedWord += character;
      }
    }

    if (cleanedWord !== "") {
      tokens.push({
        displayWord,
        word: cleanedWord,
      });
    }
  }
  return tokens;
}

function splitPargaraph(sentence) {
  return sentence.match( /[^\.!\?]+[\.!\?]+/g );
} 

function getParagraphs(text) {
  return text.split('\n').map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0)
}

function getSentances(paragraphs) {
  return flatten(paragraphs.map((paragraph, index) => splitPargaraph(paragraph).map(sentence => sentence.trim()).filter(sentence => sentence.length > 0).map((sentence => {
    return {
      displaySentence: sentence,
      sentence: sentence.toLowerCase(),
      words: tokenizeWords(sentence),
      paragraph: index,
      isQuestion: sentence.endsWith('?'),
      isExclamation: sentence.endsWith('!'),
    }
  }))));
}

function clasifySpanishSentances(sentences) {
  return sentences.map(sentence => {
    return {
      ...sentence,
      words: sentence.words.map(word => {
        return clasifyWord({ word, sentence })
      })
    }
  })
}

function clasifyWordType(type) {
  if (type.startsWith('{m')) {
    return {
      gender: 'masculine',
      category: 'noun',
    }
  } else if (type.startsWith('{art')) {
    return {
      category: 'article',
    }
  } else if (type.startsWith('{f')) {
    return {
      gender: 'femenine',
      category: 'noun',
    }
  } else if (type.startsWith('{adj')) {
    return {
      category: 'adjective',
    }
  } else if (type.startsWith('{n')) {
    return {
      category: 'noun',
    }
  } else if (type.startsWith('{adv')) {
    return {
      category: 'adverb',
    }
  } else if (type.startsWith('{conj')) {
    return {
      category: 'conjunction',
    }
  } else if (type.startsWith('{interj')) {
    return {
      category: 'interjection',
    }
  } else if (type.startsWith('{v')) {
    return {
      category: 'verb',
    }
  } else if (type.startsWith('{prep')) {
    return {
      category: 'preposition',
    }
  } else if (type.startsWith('{pron')) {
    return {
      category: 'pronoun',
    }
  } else if (type.startsWith('{num')) {
    return {
      category: 'numeral',
    }
  }

  return {
    category: type,
  }
}

function clasifyWord({ word: { word, ...rest }, sentence}) {
  let enrichedWord = {
    word,
    ...rest,
    definitions: [],
  }

  if (dictionary[word]) {
    const definitions = dictionary[word].reduce((accum, {definition, type}) => {
      return [...accum, {definition, type: clasifyWordType(type).category}]
    }, enrichedWord.defintions || [])

    enrichedWord = {
      word,
      definitions,
      ...rest,
    }
  }

  let isReflexiveCandidate = false
  if (verbs[word]) {
    const definitions = verbs[word].reduce((accum, {performer, tense, mood, translation, infinitive, long}) => {

      if (infinitive && infinitive.endsWith('se') && long) {
        const longPrefix = long.split(' ')[0]

        const word = sentence.words.find(word => word.word === longPrefix)
        if (word) {
          isReflexiveCandidate = true
        }
      }

      return [
        ...accum,
        {
          type: 'verb',
          performer,
          tense,
          mood,
          infinitive,
          longForm: long,
          defintion: translation,
        }
      ]
    },  enrichedWord.definitions || [])
    enrichedWord = {
      word,
      isReflexiveCandidate,
      definitions,
      ...rest,
    }
  } 

  return enrichedWord
}