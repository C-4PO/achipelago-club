<script>
  import Reviewer from '$lib/components/reviewer.svelte';
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import ReviewerCardPile from "$lib/components/reviewer-card-pile.svelte"
  import cardBackground from '$lib/features/story-review/images/card-background.png';

  import { deckReviewService } from '$lib/features/decks/services.js'

  export let data

  const {
    title,
    lesson,
  } = data

  const { context, step, send, slides, currentIndex, onNext } = deckReviewService({
    lesson,  
  })

  $: console.log()
</script>

<Reviewer
  cardIndex={$currentIndex}
  slides={$slides}
  enableReview={!$step[`intro`]}
  let:slide={slide}
  let:index={index}
> 
  <ReviewerCard isFlipped={index === $currentIndex && !$step[`intro`]}>
    <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
      {#if $step[`intro`] && index === 0}
        <div class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%);">
          <button class="btn btn-primary btn-wide" on:click={() => send(`START`)}>Next</button>
        </div>
      {/if}
      <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
    </div>
    <div slot="back" class="flex flex-col gap-5 h-full w-full rounded-[50px] bg-secondary">
      {#if slide.initialized}
        <ReviewerCardPile pile={slide} on:next={onNext}></ReviewerCardPile>
      {/if}
    </div>
  </ReviewerCard>
</Reviewer>