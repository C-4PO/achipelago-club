
<script>
  import StoryForm from '$lib/components/story-form.svelte';
  let saveWordsPromise = null;

  async function saveWords({
    title,
    originalStory,
    translatedStory
  }) {
    saveWordsPromise = fetch('/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        originalStory,
        translatedStory,
      })
    }).then(async (response) => {
      if (response.ok) {
        const json = await response.json();
        return json;
      }
      throw new Error(response.statusText);
    });
  }
</script>

{#if saveWordsPromise}
  {#await saveWordsPromise}
    <section class="flex flex-col p-3 items-center justify-center h-full">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <h2 class="text-center text-gray-500 text-xl font-medium">Generating story...</h2>
    </section>
  {:then json}
    <section class="flex flex-col p-3 items-center justify-center h-full">
      <a class="btn btn-accent mb-3 w-[300px]">Story</a>
      <a class="btn btn-accent mb-3 w-[300px]">List</a>
      <button class="btn btn-accent mb-3 w-[300px]">New</button>
    </section>
  {:catch error}
    <p>Something went wrong</p>
    <p>{JSON.stringify(error)}</p>
  {/await}
{:else}
  <StoryForm on:save={(event) => saveWords(event.detail)}/>
{/if}

