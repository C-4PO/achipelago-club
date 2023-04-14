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
</script>

<section class="flex flex-col p-3 h-full">
  <div class="flex justify-between w-full mb-3">
    <div class="basis-full flex justif=starty">
      <select class="select select-secondary max-w-xs" bind:value={currentLanguage}>
        <option disabled>Pick your favorite language</option>
        {#each languages as language}
          <option value={language}>{language.name}</option>
        {/each}
      </select>
    </div>
    <div class="grow-1 basis-auto flex-none flex items-center">
      <h2 class="text-center">Create Story</h2>
    </div>
    <div class="basis-full flex justify-end items-center">
      <a href="/story-list" class="btn btn-error ml-3">Cancel</a>
      <button class="btn btn-primary ml-3" on:click={() => saveWords()}>Upload</button></div>
  </div>
  <div>
    <input
      class="input input-primary mb-3 w-full"
      placeholder="Title"
      bind:value={title}
    />
  </div>
    <div class="w-full h-full">
      {#each languages as language}
        {#if language.id === currentLanguage.id}
          <textarea
            class="textarea textarea-primary w-full h-full resize-none "
            placeholder="Paste {currentLanguage.name} here."
            bind:value={currentLanguage.text} resize="false"
          />
        {/if}
      {/each}
    </div>
</section>