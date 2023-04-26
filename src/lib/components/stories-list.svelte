<script>
  import { onMount } from 'svelte';
  import ReviewerCard from '$lib/components/reviewer-card.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let isFlipped = true;
  let flipOpen = false
  export let cardBackground = '';
  export let stories = [];

  const goToCreate = () => {
    dispatch('navigate', 'create')
  }

  onMount(() => {
    setTimeout(() => {
      flipOpen = true
    }, 500)
  })
</script>

<ReviewerCard isFlipped={isFlipped && flipOpen}>
  <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
  </div>
  <div slot="back" class="flex flex-col gap-5 h-full w-full rounded-[50px] bg-secondary">
    <section class="flex flex-col p-6">
      <div class="flex justify-between w-full mb-3">
        <div class="grow-1 basis-auto flex-none flex items-center">
          <h2 class="text-center text-primary text-4xl ml-4">Stories</h2>
        </div>
        <div class="basis-full flex justify-end items-center">
          <button class="btn btn-secondary ml-3">Study</button>
          <button class="btn btn-secondary ml-3" on:click={goToCreate}>Create</button>
        </div>
      </div>
      <ul class="overflow-auto">
        {#each stories as story}
          <li class="card bg-primary text-primary-content w-full mb-3">
            <div class="card-body flex">
              <h2 class="card-title">{story.title}</h2>
              <div class="card-actions justify-end">
                <a href={`/story-review/${story.id}`} class="btn">Review</a>
                <button class="btn">Edit</button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</ReviewerCard>