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

    const grade = Math.ceil(((score / totalScore) * confidence) * 5);

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

  const inputWordCount = wordCount(inputWords);
  const referenceWordCount = wordCount(referenceWords);

  let score = 0;

  for (let i = 0; i < inputWords.length; i++) {
      const word = inputWords[i];
      if (referenceWordCount[word]) {
          score += 1;
          if (inputWordCount[word] === referenceWordCount[word]) {
              score += 1;
          }
          if (i < referenceWords.length && word === referenceWords[i]) {
              score += 1;
          } else {
              score -= 1;
          }
      } else {
          score -= 1;
      }
  }

  for (const word in referenceWordCount) {
      if (!inputWordCount[word]) {
          score -= 1;
      }
  }

  // Add Longest Common Subsequence Score
  const lcsScore = longestCommonSubsequence(inputWords, referenceWords).length;
  score += lcsScore;

  const { inputWordDetails, referenceWordDetails } = wordDetails(inputWords, referenceWords);

  const maxPossibleLcsScore = Math.min(inputWords.length, referenceWords.length);
  const totalScore = 3 * referenceWords.length + maxPossibleLcsScore;

  return { score, inputWordDetails, referenceWordDetails, totalScore };
}

function wordCount(wordArray) {
  return wordArray.reduce((count, word) => {
      count[word] = (count[word] || 0) + 1;
      return count;
  }, {});
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

function wordDetails(inputWords, referenceWords) {
  const lcs = new Set(longestCommonSubsequence(inputWords, referenceWords));

  let inputWordDetailsArr = [];
  let referenceWordDetailsArr = [];

  inputWords.forEach((word, index) => {
      const inputIndex = index;
      const referenceIndex = referenceWords.indexOf(word) !== -1 ? referenceWords.indexOf(word) : null;
      const inLcs = lcs.has(word);

      inputWordDetailsArr.push({ word, inputIndex, referenceIndex, inLcs, displayWord: word });
  });

  referenceWords.forEach((word, index) => {
      const referenceIndex = index;
      const inputIndex = inputWords.indexOf(word) !== -1 ? inputWords.indexOf(word) : null;
      const inLcs = lcs.has(word);

      referenceWordDetailsArr.push({ word, inputIndex, referenceIndex, inLcs, displayWord: word });
  });

  return { inputWordDetails: inputWordDetailsArr, referenceWordDetails: referenceWordDetailsArr };
}

function isReviewDue({ review }) {
  const ThreePMTommorow = dayjs().add(1, 'day').startOf('day').add(3, 'hour');
  return dayjs(review.due_date).isBefore(ThreePMTommorow)
}

export function getSidesFromReviews({ reviews }) {
  const sidesMap = {
    SPEAK: [
      {type: `ReadListen`},
      {type: `ReadListenGraded`},
    ],
    WRITE: [
      {type: `ReadTranslate`},
      {type: `ReadTranslateGraded`},
    ],
  }

  if (!reviews.length) {
    return flatten(Object.values(sidesMap));
  }

  const sides = reviews.reduce((acc, review) => {
    if (!isReviewDue({ review })) {
      return acc;
    }
    const { type } = review;
    const sides = sidesMap[type];
    return [...acc, ...sides];
  }, []);

  return sides;
}
