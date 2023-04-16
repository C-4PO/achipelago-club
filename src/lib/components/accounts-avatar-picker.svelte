<!-- AvatarPicker.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { createAvatar } from '@dicebear/core';
  import { notionistsNeutral } from '@dicebear/collection';
  import { dataURLtoFile } from '$lib/features/accounts/utilities';
  import { onMount } from "svelte";

  export let maxSize = 1024 * 1024; // 1 MB by default
  export let supportedFiles = ["image/png", "image/jpeg", "image/gif"];
  export let value;
  let fileInput;
  let imageUrl;
  let hover = false;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const avatar = createAvatar(notionistsNeutral, {
      backgroundColor: ["b6e3f4","c0aede","d1d4f9"],
      seed: Math.random().toString(36).substr(2, 9),
    })
    
    avatar.png().toDataUri().then((dataUri) => {
      const file = dataURLtoFile(dataUri);
      value = file
      dispatch("change", file);
      imageUrl = dataUri;
    });
  })

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    fileInput.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file && supportedFiles.includes(file.type) && file.size <= maxSize) {
      value = file;
      imageUrl = URL.createObjectURL(value);
      dispatch("change", value);
    }
  }

  function handleMouseEnter() {
    hover = true;
  }

  function handleMouseLeave() {
    hover = false;
  }
</script>

<button
  class="avatar w-24 h-24"
  on:click={handleClick}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  {#if imageUrl}
    <img src={imageUrl} alt="Avatar" class="rounded-full ring ring-primary ring-offset-base-100 ring-offset-2" />
    {#if hover}
      <div
        class="w-full h-full rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
      >
      </div>
    {/if}
  {:else}
    <div
      class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center text-gray-400 bg-gray-50"
    >
    </div>
  {/if}
</button>

<input
  type="file"
  class="hidden"
  bind:this={fileInput}
  on:change={handleFileChange}
  accept={supportedFiles.join(",")}
/>
