<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let languages = [
    { id: 'spanish', name: '🇪🇸 Spanish', text: ``},
    { id: 'english', name: '🇬🇧 English', text: ``}];

  let currentLanguage = languages[0]
  let title = ''

  function saveWords() {
    dispatch('save', {
      title,
      originalStory: languages.find((language) => language.id === 'spanish').text,
      translatedStory: languages.find((language) => language.id === 'english').text, 
    })
  }

  function onNavigate(event) {
    dispatch('navigate', 'create')
  }
</script>

<section class="flex flex-col p-6 h-full gap-3">
  <div class="flex justify-between w-full mb-3">
    <div class="grow-1 basis-auto flex-none flex items-center">
      <h2 class="text-center text-primary text-4xl ml-4">Create</h2>
    </div>
    <div class="basis-full flex justify-end items-center">
      <button class="btn btn-secondary ml-3" on:click={() => onNavigate()}>Cancel</button>
    </div>
  </div>
  <div class="w-full h-full">
    {#each languages as language}
      {#if language.id === currentLanguage.id}
        <textarea
          class="textarea textarea-primary w-full h-full resize-none rounded-3xl"
          placeholder="Paste {currentLanguage.name} here."
          bind:value={currentLanguage.text} resize="false"
        />
      {/if}
    {/each}
  </div>
  <div class="flex">
    <select class="select select-secondary rounded-full w-[60%]" bind:value={currentLanguage}>
      <option disabled>Pick your favorite language</option>
      {#each languages as language}
        <option value={language}>{language.name}</option>
      {/each}
    </select>
    <button class="btn btn-primary ml-3 btn-full" style="flex: 1 1 100%" on:click={() => saveWords()}>Upload</button>
  </div>
</section>