<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'
  import { gradeCardWrite } from '$lib/features/lessons/api.js'

  import { createEventDispatcher } from 'svelte'

  export let info

  const dispatch = createEventDispatcher()

  function next() {
    dispatch('next')
  }

  function finish() {
    dispatch('finish')
  }
</script>

<div class="p-5 flex flex-col gap-4 h-full">
  <div class="h-full flex items-center justify-center flex-col gap-2 rounded-lg" style="flex-grow: 0; overflow-y: auto;">
    <p class="text-white flex flex-wrap justify-center cardwidth:text-2xl text-xl">
      Stage Finished!
    </p>
  </div>
  {#if $info.hasRemainingCards}
    <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Continue</button>
  {/if}
  <button type="submit" class="btn btn-primary rounded-full" on:click={finish}>Finish</button>
</div>
