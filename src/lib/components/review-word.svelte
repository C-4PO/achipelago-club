<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let errorIndexes = []
  export let word
  export let sentence
  export let isLast
  export let enableReview = false
  export let selectedIndexes = []
  export let takenWordIndexes = []

  $: takenWord = takenWordIndexes.includes(word.index)
  $: selectedWord = selectedIndexes.includes(word.index)
  $: errorWord = !takenWord && !selectedWord && errorIndexes.includes(word.index)
  $: nextTakenWord = takenWordIndexes.includes(word.index + 1)
  $: nextSelectedWord = selectedIndexes.includes(word.index + 1)
  $: nextErrorWord = !nextTakenWord && !nextSelectedWord && errorIndexes.includes(word.index + 1)

  
  $: selectedSpace = selectedWord && nextSelectedWord
  $: takenSpace =  takenWord && nextTakenWord || selectedWord && nextTakenWord || takenWord && nextSelectedWord
  $: errorSpace =  errorWord && nextErrorWord || selectedWord && nextErrorWord || 
    errorWord && nextSelectedWord || takenWord && nextErrorWord || errorWord && nextTakenWord

   const clickWord = (word) => {
    if (enableReview && !takenWord) {
      dispatch('clickWord', word)
    }
   }

</script>

<span
  class:bg-red-400={errorWord}
  class:bg-gray-200={takenWord}
  class:bg-green-400={selectedWord}
  class:cursor-pointer={enableReview && !takenWord}
  class="inline-flex"
  on:click={(e) => clickWord(word)}
>
  {word.displayWord}
</span>{#if isLast}<span
  class:bg-red-400={errorSpace}
  class:bg-gray-200={takenSpace}
  class:bg-green-400={selectedSpace}
  class="inline-flex">&nbsp;</span>
{/if}