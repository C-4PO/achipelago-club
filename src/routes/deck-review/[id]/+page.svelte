<script>
  import { writable } from 'svelte/store'
  import ConceptTranslate from "$lib/components/concept-translate.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import Reviewer from '$lib/components/reviewer.svelte';
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  import { reviewService } from '$lib/features/concept-review/services'
  
  export let data
  const cards = data.deck.cards
  const summary = data.deck.summary

  const { context, step, send, transitions, states, onReview } = reviewService({
    cards,
  })

  $: slides = $context.tableCards
  $: card = $context.card

</script>
<Reviewer
  bind:cardIndex={$context.currentPileIndex}
  bind:slides={slides}
  enableReview={!$step[states.intro]}
  let:slide={slide}
  let:index={index}
> 
  <ReviewerCard isFlipped={index === $context.currentPileIndex && !$step[states.intro]}>
    <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
      {#if $step[states.intro]}
        <div class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%);">
          <button class="btn btn-primary btn-wide" on:click={() => send(transitions.START)}>Next</button>
        </div>
      {/if}
      <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
    </div>

    <div slot="back" class="flex flex-col gap-5 h-full w-full rounded-[50px] bg-secondary">
      {#if slide.id}
        <ConceptTranslate card={slide} on:review={e => {onReview(e.detail)}}/>
      {/if}
    </div>
  </ReviewerCard>
</Reviewer>



