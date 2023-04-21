<script>
  import ConceptTranslate from "$lib/components/concept-translate.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import ReviewCardConceptTranslate from "$lib/components/review-card-concept-translate.svelte";
  import Reviewer from '$lib/components/reviewer.svelte';
  export let data
  import { reviewService } from '$lib/features/concept-review/services'

  const cards = data.deck.cards

  const { context, step, send, transitions, states } = reviewService({
    cards,
  })

  $: slides = $context.reviewedCards

  $: card = $context.card
</script>

<Reviewer
  bind:cardIndex={$context.currentCardIndex}
  bind:slides={slides}
  enableReview={!$step[states.intro]}
  let:slide={slide}
  let:index={index}
> 
  <ConceptTranslate card={slide} isFlipped={index === $context.currentCardIndex && !$step[states.intro]}/>
</Reviewer>

<div class="fixed bottom-0 right-0 h-[300px] w-[300px]">
<button class="btn btn-primary btn-wide" on:click={() => send(transitions.START)}>Next</button>
<button class="btn btn-primary btn-wide" on:click={() => send(transitions.REVIEWED, { review: {
  rating: "wrong",
  cardId: $context.card.id,
} })}>Wrong</button>
<button class="btn btn-primary btn-wide" on:click={() => send(transitions.REVIEWED, { review: {
  rating: "right",
  cardId: $context.card.id,
} })}>easy</button>
</div>


