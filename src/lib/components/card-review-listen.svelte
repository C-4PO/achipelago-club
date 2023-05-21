<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let card

  const next = () => {
    dispatch('next')
  }
</script>

<div class="p-5 flex flex-col h-full">
  <div class="h-full">
    <p class="text-white text-5xl flex flex-wrap justify-center">
      <ReviewerWords words={card.words}/>
    </p>
  </div>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Next</button>
</div>
