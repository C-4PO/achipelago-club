<script>
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import ReviewerCardFace from "$lib/components/reviewer-card-face.svelte";
  import { cardReviewService } from '$lib/features/cards/services.js'
  import { createEventDispatcher } from 'svelte'

  export let pile

  const dispatch = createEventDispatcher()
  let shared = {}
  let finalAction = `next`

  const onFinish = async () => {
    dispatch('next', {
      results: shared,
      action: finalAction,
    })
  }

  const {
    isFlipped,
    front,
    back,
    step,
    send,
    onNext,
  } = cardReviewService({ pile, onFinish })

  const next = ({ detail }) => {
    shared = {
      ...shared,
      ...detail
    }
    onNext({ shared })
  }

  const finish = ({ detail }) => {
    dispatch('finish', detail)
  }
</script>

<div class="flex flex-col w-full h-full">
  <ReviewerCard isFlipped={$isFlipped}>
    <div slot="front" class="h-full rounded-[50px] overflow-hidden">
      {#if $front}
        <ReviewerCardFace
          bind:key={$front.key}
          bind:card={pile.card}
          bind:type={$front.type}
          bind:shared={shared}
          on:next={next}
          on:finish={finish}
        />
      {/if}
    </div>
    <div slot="back" class="h-full rounded-[50px] overflow-hidden">
      {#if $back}
        <ReviewerCardFace
          bind:key={$back.key}
          bind:card={pile.card}
          bind:type={$back.type}
          bind:shared={shared}
          on:next={next}
          on:finish={finish}
        />
      {/if}
    </div>
  </ReviewerCard>
</div>