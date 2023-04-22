<script>
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import { createEventDispatcher } from 'svelte'
  const dispatchEvent = createEventDispatcher()

  export let wordAdded
  export let cantAdd
  export let selectedWords
  export let selectedTranslations
  export let sentenceId

  function createConcept() {
    let words = selectedWords
    let tranlationWords = selectedTranslations

    let concept = {
      sentenceId: sentenceId,
      words: words,
      translationWords: tranlationWords
    }

    dispatchEvent('create', concept)
  }

  $: canSubmit = selectedWords.length && selectedTranslations.length
</script>

<div class="rounded-3xl bg-white p-3 text-black">
  <h3 class="text-sm font-bold text-center pb-1">Create Card</h3>
  <div class="flex justify-spacebetween">
    <div class="select-none p-1 w-full">
      <h4 class="text-xs text-center">🇪🇸</h4>
      {#if selectedWords.length > 0}
        <p class="text-center p-1">{selectedWords.map(word => word.word).join(' ')}</p>
      {:else}
        <p class="text-center p-1 text-slate-300">Select word</p>
      {/if}
    </div>
    <div class="select-none p-1 w-full text-left">
      <h4 class="text-xs text-center">🇬🇧</h4>
      {#if selectedTranslations.length > 0}
        <p class="text-center p-1">{selectedTranslations.map(word => word.word).join(' ')}</p>
      {:else}
        <p class="text-center p-1 text-slate-300">Select word</p>
      {/if}
    </div>
  </div>
  {#if canSubmit}
    <button
      type="submit"
      class="btn btn-sm btn-primary block mt-1 btn-block rounded-full"
      on:click={createConcept}
    >
      Add
    </button>
  {/if}
</div>