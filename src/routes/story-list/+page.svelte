<script>
  import Reviewer from '$lib/components/reviewer.svelte';
  export let data;

  const stories = data.stories || [];
</script>

<section class="flex flex-col p-3">
  <div class="flex justify-between w-full mb-3">
    <div class="basis-full flex justif=starty">
    </div>
    <div class="grow-1 basis-auto flex-none flex items-center">
      <h2 class="text-center">Stories</h2>
    </div>
    <div class="basis-full flex justify-end items-center">
      <button class="btn btn-secondary ml-3">Study</button>
      <a class="btn btn-secondary ml-3" href="/story-generate">Create</a>
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

