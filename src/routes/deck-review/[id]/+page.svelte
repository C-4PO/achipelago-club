<script>
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

<button class="btn btn-primary btn-wide" on:click={() => send(transitions.START)}>Next</button>
<button class="btn btn-primary btn-wide" on:click={() => send(transitions.REVIEWED, { review: {
  rating: "wrong",
  cardId: $context.card.id,
} })}>Wrong</button>
<button class="btn btn-primary btn-wide" on:click={() => send(transitions.REVIEWED, { review: {
  rating: "right",
  cardId: $context.card.id,
} })}>easy</button>
<Reviewer bind:index={$context.currentCardIndex} bind:slides={slides}/>