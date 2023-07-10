<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'
  import { gradeCardWrite } from '$lib/features/lessons/api.js'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()e

  function next() {
    dispatch('next', {
      action: `next`
    })
  }

  function end() {
    dispatch('next', {
      action: `finish`
    })
  }
</script>

<div class="p-5 flex flex-col gap-4 h-full">
  <div class="h-full flex items-center justify-center flex-col gap-2 rounded-lg" style="flex-grow: 0; overflow-y: auto;">
    <p class="text-white flex flex-wrap justify-center cardwidth:text-2xl text-xl">
      Stage Finished!
    </p>
  </div>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Continue</button>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next}>Finish</button>
</div>
