<script>
  import Reviewer from '$lib/components/reviewer.svelte';
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import ReviewerCardPile from "$lib/components/reviewer-card-pile.svelte"
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  import { onMount } from 'svelte';

  import { deckReviewService } from '$lib/features/decks/services.js'

  export let data

  let isLoading = true

  let {
    title,
    drawPile,
    stage,
    cards,
    deckId,
  } = data

  const isLeadingAudio = false

  drawPile = drawPile.map(lesson => {
      const card = {
        ...cards.find(card => card.id === lesson.cardId),
      }
      return {
        ...lesson,
        card,
      }
  })

  onMount(() => {
    if (isLeadingAudio) {
      Promise.all(
        lesson.map(lesson =>
          fetch(`/api/text-to-speech`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',  // change to 'application/json'
            },
            body: JSON.stringify({ text: lesson.card.sentence }),
          }).then(response => response.arrayBuffer())
        )
      ).then((audioBuffers) => {
        const audioUrls = audioBuffers.map(audioBuffer => URL.createObjectURL(new Blob([audioBuffer], {type: 'audio/mp3'})));  // specify the Blob content type
        lesson = lesson.map((lesson, index) => {   // assign updated lesson array to itself
          lesson.card.audio = audioUrls[index];
          return lesson;
        });
        isLoading = false;
      });
    } else {
      isLoading = false;
    }
  });

  const { context, step, send, slides, currentIndex, onNext, onFinish } = deckReviewService({
    drawPile,
    stage,
    deckId,
    cards,
  })
</script>

<Reviewer
  cardIndex={$currentIndex}
  slides={$slides}
  enableReview={!$step[`intro`]}
  let:slide={slide}
  let:index={index}
  let:show={show}
> 
  <ReviewerCard isFlipped={index === $currentIndex && !$step[`intro`]}>
    <div slot="front" class="rounded-[50px] h-full w-full overflow-hidden bg-secondary">
      {#if $step[`intro`] && index === 0}
        <div class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%);">
          <button class="btn btn-primary btn-wide" on:click={() => send(`START`)} disabled={isLoading}>Next</button>
        </div>
      {/if}
      <img src={cardBackground} alt="card background" class="w-full h-full object-cover"/>
    </div>
    <div slot="back" class="flex flex-col gap-5 h-full w-full rounded-[50px] bg-secondary">
      {#if slide.initialized && show}
        <ReviewerCardPile pile={slide.pile} on:next={onNext} on:finish={onFinish}></ReviewerCardPile>
      {/if}
    </div>
  </ReviewerCard>
</Reviewer>