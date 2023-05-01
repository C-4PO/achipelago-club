<script>
	import '@splidejs/svelte-splide/css';
  import { Confetti } from "svelte-confetti"
  import { stateIndex } from '$lib/features/utilities.js';
  import { onMount } from 'svelte';
  import { interpret } from 'xstate';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import { reviewService } from '$lib/features/story-review/service.js';
  import cardBackground from '$lib/features/story-review/images/card-background.png';

  import Reviewer from '$lib/components/reviewer.svelte';
  import ConceptTranslate from "$lib/components/concept-translate.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";

  export let data

  const {
    cards,
    context,
    step,
    send,
    states,
    transitions,
  } = reviewService({ cards: data.cards })


  const onReview = (review) => {
    send('NEXT_CARD', { review })
  }

  let slides = data.cards

</script>

<Reviewer
  bind:cardIndex={$context.currentCardIndex}
  bind:slides={slides}
  enableReview={!$step[states.intro]}
  let:slide={slide}
  let:index={index}
> 
  <ReviewerCard isFlipped={index === $context.currentCardIndex && !$step[states.intro] && !$step[states.summary]}>
    <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
      {#if $step[states.intro] && index === 0}
        <div class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%);">
          <button class="btn btn-primary btn-wide" on:click={() => send(transitions.START)}>Start</button>
        </div>
      {/if}
      {#if $step[states.summary] && index === slides.length - 1}
        <div class="absolute top-0 right-0 left-0 bottom-0 rounded-[50px]">
          <div class="absolute top-[50%] left-[50%] mb-4" style="transform: translate(-50%, -50%);">
            <a class="btn btn-primary btn-wide mb-3" href="/story-list">Finish</a>
            <a class="btn btn-primary btn-wide" href="/story-review/{data.id}">Repeat!</a>
          </div>
        </div>
      {/if}
      <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
    </div>

    <div slot="back" class="flex flex-col gap-5 h-full w-full rounded-[50px] bg-secondary">
      {#if slide.id}
        <ConceptTranslate card={slide} on:review={e => {
          onReview(e.detail)
        }}/>
      {/if}
    </div>
  </ReviewerCard>
</Reviewer>
