<script>
	import ErrorBoundary from 'svelte-error-boundary';
  import Word from './review-word.svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let title = ''
  export let sentence
  export let original = ''
  export let errorIndexes = []
  export let enableReview = false
  export let selectedIndexes = []
  export let takenWordIndexes = []
  export let highlightedIndexes = []

  let isOriginal = false
  const toggleOriginal = (_isOriginal) => {
    isOriginal = _isOriginal
  }

  const clickWord = (word) => {
    dispatch('clickWord', word)
  }
</script>


<div class="rounded-3xl bg-white p-3 text-black">
  {#if title}
    <h3 class="text-sm font-bold text-center pb-1">{title}</h3>
  {/if}
  {#if original}
    <div class="tabs tabs-boxed flex justify-center mb-3">
      <button
        class:tab-active={isOriginal}
        on:click={() => toggleOriginal(true)}
        class="tab">Original</button> 
      <button class:tab-active={!isOriginal} class="tab" on:click={() => toggleOriginal(false)} >Translated</button> 
    </div>
  {/if}

  {#if original && isOriginal}
    <p class="select-none">{original}</p>
  {:else}
    <p class="select-none">
      {#each sentence.words as word, i}
        <Word
          word={word}
          sentence={sentence}
          errorIndexes={errorIndexes}
          selectedIndexes={selectedIndexes}
          takenWordIndexes={takenWordIndexes}
          highlightedIndexes={highlightedIndexes}
          isLast={i < sentence.words.length - 1}
          enableReview={enableReview}
          on:clickWord={(e) => clickWord(e.detail)}
        />
      {/each}
    </p>
  {/if}
</div>

