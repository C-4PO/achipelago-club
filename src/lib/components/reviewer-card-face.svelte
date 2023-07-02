<script>
  import { createEventDispatcher } from 'svelte'
  import CardReviewListen from '$lib/components/card-review-listen.svelte'
  import CardSentenceTranslate from '$lib/components/card-sentence-translate.svelte'
  import CardReviewListenGraded from '$lib/components/card-review-listen-graded.svelte'

  const dispatch = createEventDispatcher()

  export let key
  export let type
  export let card
  export let shared

  const next = ({ detail }) => {
    dispatch(`next`, detail)
  }
</script>

{#if type === `ReadListen`}
  {#key key} 
    <CardReviewListen card={card} on:next={next} />
  {/key}
{:else if type === `ReadTranslate`}
  {#key key} 
    <CardSentenceTranslate card={card} on:next={next} />
  {/key}
{:else if type === `ReadListenGraded`}
  {#key key} 
    <CardReviewListenGraded card={card} on:next={next} result={shared[`SPEAK`]} />
  {/key}
{:else if type === `ReadTranslateGraded`}
  {#key key} 
    <CardReviewListenGraded card={card} on:next={next} result={shared[`WRITE`]} />
  {/key}
{:else if type === `ConceptReview`}
  {#key key} 
    <h1 class="text-white">Concept Review</h1>
  {/key}
{/if}


