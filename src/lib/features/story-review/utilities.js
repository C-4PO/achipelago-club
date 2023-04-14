import { diffChars } from 'diff'
import { uniq } from 'lodash'

export function getRemovedCharIndexes(str1, str2) {
  const diff = diffChars(str1, str2);
  const removedCharIndexes = [];
  let wordIndex = 0;
  let charIndex = 0;

  diff.forEach(part => {
    const chars = part.value.split('');

    if (part.removed) {
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') {
          wordIndex++;
        } else {
          removedCharIndexes.push(wordIndex);
        }
      }
    } else {
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') {
          wordIndex++;
        }
      }
    }

    charIndex += chars.length;
  });

  return uniq(removedCharIndexes);
}


