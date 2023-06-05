<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let card

  const next = () => {
    dispatch('next')
  }
</script>

<div class="p-5 flex flex-col h-full">
  <div class="h-full">
    <p class="text-white flex flex-wrap justify-center text-3xl">
      <ReviewerWords words={card.words}/>
    </p>
  </div>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Next</button>
</div>
