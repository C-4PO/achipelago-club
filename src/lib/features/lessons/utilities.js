import { cleanSentence } from '$lib/features/story/utilities'
import dayjs from 'dayjs';
import { flatten } from 'lodash';

export function gradeCard({ sentence, inputText, confidence = 1 }) {
    const {
      score,
      inputWordDetails,
      referenceWordDetails,
      totalScore
    } = stringComparison({ inputText, referenceString: sentence });

    const grade = Math.max(0, Math.ceil(((score / totalScore) * confidence) * 5));

    return {
      data: {
        grade,
        score,
        totalScore,
        inputWordDetails,
        referenceWordDetails
      }
    };
}

export function gradeWrittenCard({ sentence, inputText }) {
  const {
    inputWordDetails,
    referenceWordDetails,
    totalScore,
    score,
  } = stringComparison({ inputText, referenceString: sentence });

  const additionalWords = inputWordDetails.filter(({ referenceIndex, isMistake }) => referenceIndex === null && !isMistake);
  const mistakeWords = inputWordDetails.filter(({ isMistake }) => isMistake);
  const missingWords = referenceWordDetails.filter(({ inputIndex }) => inputIndex === null);

  const grade = Math.max(0, Math.floor(5 - (Math.ceil(additionalWords.length * 0.5) + (missingWords.length - mistakeWords.length))));
  
  return {
    data: {
      grade,
      score,
      totalScore,
      inputWordDetails,
      referenceWordDetails
    }
  };
}

function stringComparison({ inputText, referenceString }) {
  const inputWords = cleanSentence(inputText).trim().split(' ');
  const referenceWords = cleanSentence(referenceString).trim().split(' ');

  const lcs = longestCommonSubsequence(inputWords, referenceWords);

  const { inputWordDetails, referenceWordDetails } = wordDetails(inputWords, referenceWords, lcs);

  const score = lcs.length;
  const totalScore = referenceWords.length;

  return { inputWordDetails, referenceWordDetails, score, totalScore };
}

function longestCommonSubsequence(inputWords, referenceWords) {
  const matrix = Array(inputWords.length + 1)
      .fill(null)
      .map(() =>
          Array(referenceWords.length + 1).fill(null)
      );

  for (let i = 0; i <= inputWords.length; i += 1) {
      for (let j = 0; j <= referenceWords.length; j += 1) {
          if (i === 0 || j === 0) {
              matrix[i][j] = { length: 0, sequence: [], pointer: null };
          } else if (inputWords[i - 1] === referenceWords[j - 1]) {
              matrix[i][j] = {
                  length: matrix[i - 1][j - 1].length + 1,
                  sequence: matrix[i - 1][j - 1].sequence.concat(inputWords[i - 1]),
                  pointer: 'diagonal',
              };
          } else if (matrix[i - 1][j].length > matrix[i][j - 1].length) {
              matrix[i][j] = {
                  length: matrix[i - 1][j].length,
                  sequence: matrix[i - 1][j].sequence,
                  pointer: 'up',
              };
          } else {
              matrix[i][j] = {
                  length: matrix[i][j - 1].length,
                  sequence: matrix[i][j - 1].sequence,
                  pointer: 'left',
              };
          }
      }
  }

  return matrix[inputWords.length][referenceWords.length].sequence;
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function wordDetails(inputWords, referenceWords, lcs) {
  const lcsSet = new Set(lcs);

  let inputWordDetailsArr = [];
  let referenceWordDetailsArr = [];

  inputWords.forEach((word, index) => {
    const inputIndex = index;
    const referenceIndex = referenceWords.indexOf(word) !== -1 ? referenceWords.indexOf(word) : null;
    const inLcs = lcsSet.has(word);

    // Determine if the word is a spelling mistake
    let isMistake = false;
    if (!inLcs) {
      for (const refWord of referenceWords) {
        if (levenshteinDistance(word, refWord) === 1) {
          isMistake = true;
          break;
        }
      }
    }

    inputWordDetailsArr.push({ word, inputIndex, referenceIndex, inLcs, isMistake, displayWord: word });
  });

  referenceWords.forEach((word, index) => {
    const referenceIndex = index;
    const inputIndex = inputWords.indexOf(word) !== -1 ? inputWords.indexOf(word) : null;
    const inLcs = lcsSet.has(word);

    referenceWordDetailsArr.push({ word, inputIndex, referenceIndex, inLcs, displayWord: word });
  });

  return { inputWordDetails: inputWordDetailsArr, referenceWordDetails: referenceWordDetailsArr };
}

export function isReviewDue({ review }) {
  const ThreePMTommorow = dayjs().add(1, 'day').startOf('day').add(3, 'hour');
  return dayjs(review.due_date).isBefore(ThreePMTommorow)
}

export function isReviewOverdue({ review }) {
  return dayjs(review.due_date).isBefore(dayjs())
}

export function getSidesForRead({ reviews }) {
  const sidesMap = {
    // SPEAK: [
    //   {type: `ReadListen`},
    //   {type: `ReadListenGraded`},
    // ],
    WRITE: [
      {type: `ReadTranslate`},
      {type: `ReadTranslateGraded`},
    ],
  }

  let sides = []
  for (const reviewType of Object.keys(sidesMap)) {
    const review = reviews.find(({ type }) => type === reviewType)
    if (!review || isReviewDue({ review })) {
      sides = [...sides, ...sidesMap[reviewType]]
    }
  }

  return sides;
}

export function getSectionsForReview({ reviews }) {
  const sidesMap = {
    // SPEAK: [
    //   {type: `ReadListen`},
    //   {type: `ReadListenGraded`},
    // ],
    WRITE: [
      {type: `ReadTranslate`},
      {type: `ReadTranslateGraded`},
    ],
  }

  let sections = {}
  for (const reviewType of Object.keys(sidesMap)) {
    const review = reviews.find(({ type }) => type === reviewType)
    if (!review || isReviewDue({ review })) {
      sections = {...sections, [reviewType]: {
        sides: sidesMap[reviewType],
        review,
      }}
    }
  }

  return sections;
}

