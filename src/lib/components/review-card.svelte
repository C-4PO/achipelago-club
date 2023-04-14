<script>
  import ReviewSentence from '$lib/components/review-sentence.svelte';
  import ReviewCardTranslate from '$lib/components/review-card-translate.svelte';
  import cardBackground from '$lib/features/story-review/images/card-background.png';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  export let isShow = false;
  export let isFocused = false;
  export let isReviewed = false;
  export let card
  export let step

  const onReview = (review) => {
    dispatch('review', review);
  }
  
</script>

<style>
  @media (max-width: 459px) {
    .card {
      width: calc(100vw - 3rem);
      height: calc(calc(100vw -  3rem) * 1.59);
      max-width: 410px;
      max-height: 650px;
    }
  }

  @media (min-width: 460px) {
    .card {
      width: calc(calc(80vh - 3rem) * 0.63);
      height: calc(80vh - 3rem);
    }
  }

  .card {
    max-width: 410px;
    max-height: 650px;
  }
  
  .card-side {
    background-color: #2889a5;
    background-image: linear-gradient(180deg, #2889a5 0%, #2785a1 11%, #114b62 20%, #0a2132 30%, #121521 50%, #121523 100%);
  }
</style>

<div class=" flex items-center rounded-md" style="padding-top: 4vh; padding-bottom: 4vh">
  <div class="perspective-1000 card">
    <div class:rotate-y-180={isShow && isFocused && !isReviewed} class="relative w-full h-full transform-60ms preserve-3d">
      <div class="rounded-[50px] card-side overflow-hidden absolute w-full h-full backface-visibility-hidden">
        <img src={cardBackground} alt="card background" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col p-5 gap-5 card-side overflow-hidden rounded-[50px] absolute w-full h-full rotate-y-180 backface-visibility-hidden">
        {#if card.type === 'writeSentence'}
          <ReviewCardTranslate
            on:review={(e) => onReview(e.detail)}
            step={step}
            card={card}
          />
        {/if}
      </div>
    </div>
  </div>
</div>

