
<script>
  import ConceptTranslateFront from "$lib/components/ccncept-translate-front.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  export let isFlipped
  export let card = {}
</script>

<div class="flex flex-col w-full h-full">
  <ReviewerCard isFlipped={isFlipped}> 
    {#if card.id}
      <ConceptTranslateFront front={card.front}/>
    {/if}
  </ReviewerCard>
</div>