<script>
  import ReviewerSentence from '$lib/components/reviewer-sentence.svelte';
  import ReviewerSection from '$lib/components/reviewer-section.svelte'
  export let front = {}

  export let isFlipped = false


  let input = ''
</script>

<div class="flex flex-col h-full gap-5 overflow-auto rounded-3xl">
  <ReviewerSection title="Word">
    <ReviewerSentence
      sentence={{ words: front.concept.sentence }}
      isCentered
    />
  </ReviewerSection>
  <!-- <input
    class="input text-black p-4 rounded-3xl bg-white resize-none"
    placeholder="Translate the Word"
    bind:value={input}
  />  -->
  <ReviewerSection title="Context">
    <ReviewerSentence sentence={{ words: front.sentence.sentence }} title="Context"/> 
  </ReviewerSection>
  <textarea
    class="text-area text-black p-4 h-full rounded-3xl bg-white resize-none"
    placeholder="Translate the prompt"
    bind:value={input}
  /> 
  <button class="btn btn-primary rounded-full">Next</button>
</div>