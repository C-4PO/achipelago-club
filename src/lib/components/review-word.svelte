<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let errorIndexes = []
  export let word
  export let isLast
  export let enableReview = false
  export let selectedIndexes = []
  export let takenWordIndexes = []
  export let highlightedIndexes = []

  const isInArray = (arr, index) => arr.includes(index)
  const isNextInArray = (arr, index) => arr.includes(index + 1)

  $: takenWord = isInArray(takenWordIndexes, word.index)
  $: selectedWord = isInArray(selectedIndexes, word.index)
  $: errorWord = !selectedWord && isInArray(errorIndexes, word.index)
  $: highlightedWord = isInArray(highlightedIndexes, word.index)

  $: nextHighlightedWord = isNextInArray(highlightedIndexes, word.index)
  $: nextSelectedWord = isNextInArray(selectedIndexes, word.index)
  $: nextErrorWord = !highlightedWord && !nextSelectedWord && isInArray(errorIndexes, word.index + 1)

  $: errorTakenWord = errorWord && takenWord
  $: errorHighlightedWord = errorWord && highlightedWord

  $: selectedSpace = selectedWord && nextSelectedWord
  $: highlightedSpace = highlightedWord && nextHighlightedWord || selectedWord && nextHighlightedWord || highlightedWord && nextSelectedWord
  $: errorSpace = errorWord && nextErrorWord || selectedWord && nextErrorWord || errorWord && nextSelectedWord || errorWord && nextHighlightedWord || selectedWord && nextHighlightedWord || selectedWord && nextErrorWord || highlightedWord && nextErrorWord || errorWord && highlightedWord
  $: errorHighlightedSpace = errorSpace && highlightedSpace

  const clickWord = (word) => {
    if (enableReview && !takenWord) {
      dispatch('clickWord', word)
    }
  }
</script>

<span
  class:bg-red-400={!errorHighlightedWord && errorWord}
  class:bg-green-400={selectedWord}
  class:bg-yellow-400={!errorHighlightedWord && highlightedWord}
  class:bg-red-700={errorHighlightedWord}
  class:cursor-pointer={enableReview && !takenWord}
  class="inline-flex"
  on:click={(e) => clickWord(word)}
>
  {word.displayWord}
</span>{#if isLast}<span
  class:bg-red-400={errorSpace}
  class:bg-yellow-400={highlightedSpace && !errorWord}
  class:bg-green-400={selectedSpace}
  class:bg-red-700={errorHighlightedSpace}
  class="inline-flex">&nbsp;</span>
{/if}
