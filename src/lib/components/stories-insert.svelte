<script>
  import StoryForm from '$lib/components/story-form.svelte';
  import get from 'lodash/get.js';
  import ReviewerCard from '$lib/components/reviewer-card.svelte';
  import { createEventDispatcher } from 'svelte';
  import { saveWords } from '$lib/features/story-generate/api.js';

  let saveWordsPromise = null;
  const dispatch = createEventDispatcher();

  export let cardBackground = '';
  export let isFlipped;

  const handleSaveWords = async (words) => {
    saveWordsPromise = saveWords(words).catch(e => {
      console.log(e);
    });
  };

  const handleNavigate = (location) => {
    saveWordsPromise = null
    dispatch('navigate', location);
  };
</script>

<ReviewerCard isFlipped={isFlipped}>
  <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
  </div>
  <div slot="back" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <ReviewerCard isFlipped={!!saveWordsPromise}>
      <div slot="back" class="h-full">
        {#await saveWordsPromise}
          <section class="flex flex-col p-3 items-center justify-center h-full">
            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <h2 class="text-center text-gray-500 text-xl font-medium">Generating story...</h2>
          </section>
        {:then json}
          <section class="flex flex-col p-3 items-center justify-center h-full">
            <a href="/story-review/{get(json, "id")}" class="btn btn-accent mb-3 w-[300px]">Story</a>
            <button class="btn btn-accent mb-3 w-[300px]" on:click={handleNavigate}>List</button>
          </section>
        {:catch error}
          <p>Something went wrong</p>
          <p>{JSON.stringify(error)}</p>
        {/await}
      </div>
      <div slot="front" class="h-full">
          <StoryForm on:save={(event) => handleSaveWords(event.detail)} on:navigate={handleNavigate}/>
      </div>
    </ReviewerCard>
  </div>
</ReviewerCard>
