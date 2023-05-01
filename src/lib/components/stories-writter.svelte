<script>
  import { generateStory } from '$lib/features/story-generate/api';
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import StoriesGPTForm from "$lib/components/stories-writter-gpt-form.svelte";
  import { createEventDispatcher } from 'svelte';

  export let isFlipped = false;
  let innerFlipped = false;
  let isLoading = false;
  let response

  const dispatch = createEventDispatcher();

  async function generate({ prompt }) {
    isLoading = true;
    response = await generateStory({ prompt })
    isLoading = false;
  }
</script>

<ReviewerCard isFlipped={isFlipped}>
  <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
  </div>
  <div slot="back" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <ReviewerCard isFlipped={innerFlipped}>
      <div slot="front" class="h-full">
        <StoriesGPTForm on:generate={e => generate(e.detail)} isLoading={isLoading} response={response}/>
      </div>
      <div slot="back" class="h-full">
        <h1>Front</h1>
      </div>
    </ReviewerCard>
  </div>
</ReviewerCard>