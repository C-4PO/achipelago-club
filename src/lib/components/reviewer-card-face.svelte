<script>
  import { createEventDispatcher } from 'svelte'
  import CardReviewListen from '$lib/components/card-review-listen.svelte'
  import CardSentenceTranslate from '$lib/components/card-sentence-translate.svelte'
  import CardReviewListenGraded from '$lib/components/card-review-listen-graded.svelte'
  import CardStageFinished from '$lib/components/card-stage-finished.svelte'

  const dispatch = createEventDispatcher()

  export let key
  export let type
  export let card
  export let shared
  export let info

  const next = ({ detail }) => {
    dispatch(`next`, detail)
  }

  const finish = ({ detail }) => {
    dispatch(`finish`, detail)
  }
</script>

{#if type === `ReadListen`}
  {#key key} 
    <CardReviewListen card={card} on:next={next} info={info} />
  {/key}
{:else if type === `ReadTranslate`}
  {#key key} 
    <CardSentenceTranslate card={card} on:next={next} info={info} />
  {/key}
{:else if type === `ReadListenGraded`}
  {#key key} 
    <CardReviewListenGraded card={card} on:next={next} result={shared[`SPEAK`]} info={info} />
  {/key}
{:else if type === `ReadTranslateGraded`}
  {#key key} 
    <CardReviewListenGraded card={card} on:next={next} result={shared[`WRITE`]} info={info} />
  {/key}
{:else if type === `stageSummary`}
  {#key key}
    <CardStageFinished on:next={next} on:finish={finish} info={info}/>
  {/key}
{/if}


