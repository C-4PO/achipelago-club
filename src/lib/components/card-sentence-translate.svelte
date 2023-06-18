<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let card

  let userInput = ''

  const next = () => {
    dispatch('next', {
      userInput,
    })
  }
</script>

<div class="p-5 flex flex-col gap-4 h-full">
  <div class="h-full flex items-center justify-center flex-col gap-2 rounded-lg" style="flex-grow: 0; overflow-y: auto;">
    <p class="text-white flex flex-wrap justify-center cardwidth:text-2xl text-xl">
      <ReviewerWords words={card.words}/>
    </p>
    <div class="w-full p-3 h-1/2">
      <textarea class="text-area text-black p-2 cardWidth:p-3 h-full rounded-3xl w-full bg-white resize-none" bind:value={userInput} placeholder="Translate to english..."></textarea>
    </div>
  </div>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Next</button>
</div>
