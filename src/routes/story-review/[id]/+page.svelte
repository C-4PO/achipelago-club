<script>
	import '@splidejs/svelte-splide/css';
  import { stateIndex } from '$lib/features/utilities.js';
  import { onMount } from 'svelte';
  import { interpret } from 'xstate';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import ReviewCarousel from '$lib/components/review-carousel.svelte';
  import ReviewCard from '$lib/components/review-card.svelte';
  import { reviewService } from '$lib/features/story-review/service.js';

  export let data

  console.log(JSON.stringify(data.cards[0], null, 2))

  const {
    cards,
    context,
    step,
    send,
  } = reviewService({ cards: data.cards })

  const onReview = (review) => {
    send('NEXT_CARD', { review })
  }

  const next = () => storyReviewService.send('NEXT')
</script>

<!-- <div class="h-full p-3 flex flex-col gap-3">
  <div class="h-full flex justify-center overflow-hidden items-center relative rounded-lg">
    <ReviewCarousel
      context={context}
      step={step}
      on:next={next}
      on:review={(e) => onReview(e.detail)}
    />
    {#if $step[`intro`]}
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-secondary to-transparent flex items-center justify-center" >
        <button class="btn btn-primary btn-lg" on:click={() => send('START')}>Start</button>
      </div>
    {/if}
  </div>
</div> -->
