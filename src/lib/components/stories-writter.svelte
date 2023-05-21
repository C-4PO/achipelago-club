<script>
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import StoriesGPTForm from "$lib/components/stories-writter-form.svelte";
  import { createEventDispatcher } from 'svelte';
  import { saveWords } from '$lib/features/story-generate/api.js';
  const dispatch = createEventDispatcher();

  export let isFlipped = false;

  const onAccept = (detail) => {
    dispatch('navigate', {
      type: `story-review`,
      params: detail
    })
  }

  const onCancel = () => {
    dispatch('navigate', {
      type: `stories`
    })
  }

  const onRetry = () => {
    isFlipped = false;
  }

</script>

<ReviewerCard isFlipped={isFlipped}>
  <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
  </div>
  <div slot="back" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
    <StoriesGPTForm on:accept={(e) => onAccept(e.detail)} on:cancel={onCancel}/>
  </div>
</ReviewerCard>