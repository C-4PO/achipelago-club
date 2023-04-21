<script>
  import ReviewerSection from '$lib/components/reviewer-section.svelte'
  import Word from '$lib/components/review-word.svelte'
  export let sentence
  export let isCentered
</script>

<div class:text-center={isCentered} class="">
  {#each sentence.words as word, i}
    <Word 
      word={word} 
      sentence={sentence}
      isLast={i < sentence.words.length - 1} />
  {/each}
</div>
