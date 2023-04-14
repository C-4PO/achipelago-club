<script>
  import ReviewCard from '$lib/components/review-card.svelte';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { createEventDispatcher } from 'svelte';

  export let step
  export let context
  
  const dispatch = createEventDispatcher();
  let slider = null;

  context.subscribe((context) => {
    if (slider) {
      slider.go(context.currentCardIndex)
    }
  })

  const onReview = (review) => {
    dispatch('review', review)
  }
</script>

<Splide bind:this={slider} options={{
    rewind: false,
    gap: '1rem',
    width: '100%',
    focus    : 'center',
    trimSpace: false,
    drag: false,
    autoWidth: true,
    pagination: false,
    arrows: false
  }}>
  {#each $context.cards as card, i}
    <SplideSlide>
      <ReviewCard
        card={card}
        step={step}
        context={context}
        isReviewed={i < $context.currentCardIndex}
        isFocused={$context.currentCardIndex === i}
        isShow={!$step.intro}
        on:review={(e) => onReview(e.detail)}
      />
    </SplideSlide>
  {/each}
</Splide>