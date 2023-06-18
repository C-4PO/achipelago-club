<script>
  import { createEventDispatcher } from 'svelte'
  import CardReviewListen from '$lib/components/card-review-listen.svelte'
  import CardSentenceTranslate from '$lib/components/card-sentence-translate.svelte'

  const dispatch = createEventDispatcher()

  export let key
  export let type
  export let card

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
{:else if type === `ConceptReview`}
  {#key key} 
    <h1 class="text-white">Concept Review</h1>3
  {/key}
{/if}


