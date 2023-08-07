<script>
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte';
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import { createEventDispatcher } from 'svelte'

  export let result
  export let card
  const dispatch = createEventDispatcher()

  const GREEN = '#00A676'
  const YELLOW = '#F7B538'
  const RED = '#780116'

  const {
    review,
    grade,
    score,
    totalScore,
    inputWordDetails = [],
    allWordDetails = [],
    referenceWordDetails = [],
    cardId,
    confidence,
  } = result


  const backgroundColor = getBackgroundColor({ grade })
  const detectedColorIndices = inputWordDetails.map((detectedWord) => ({
    index: detectedWord.inputIndex,
    color: getWordColor(detectedWord),
  }))
  const referenceColorIndices = referenceWordDetails.map((detectedWord) => ({
    index: detectedWord.referenceIndex,
    color: getWordColor(detectedWord),
  }))

  const originalWordsindicies = card.words.map((detectedWord, index) => ({
    index: index,
  }))


  const colorPriorities = {
    [RED]: 1,
    [YELLOW]: 2,
    [GREEN]: 3,
  }

  function getWordColor({ inputIndex, referenceIndex, inLcs, word }) {
    if (inputIndex !== null && referenceIndex !== null && inLcs) {
      return GREEN;
    } else if (inputIndex !== null || inLcs) {
      return YELLOW;
    } else {
      return RED;
    }
  }

  function getBackgroundColor ({ grade }) {
    if (grade >= 4) {
      return GREEN
    } else if (grade >= 3) {
      return YELLOW
    } else {
      return RED
    }
  }

  function handleKey(event) {
    if (event.key === 'Enter') {
      next()
    }
  }

  const next = (response) => {
    dispatch('next', {})
  }

  function init(el){
    el.focus()
  }
</script>

<div class="flex flex-col h-full gap-5 rounded-3xl justify-between p-5" on:keydown={handleKey} style="background-color: {backgroundColor}">
  <div class="flex flex-col h-full gap-5 overflow-auto rounded-3xl">
    <header class="flex justify-center items-center flex-col">
      {#if grade >= 4}
        <Icon icon="mingcute:check-fill" class="inline-block text-white text-lg" width="70" height="70" />
        <h3 class="text-white text-2xl font-bold">Great job!</h3>
      {:else if grade >= 3}
        <Icon icon="ph:smiley-meh-bold" class="inline-block text-white text-lg" width="70" height="70" />
        <h3 class="text-white text-2xl font-bold">Not bad!</h3>
      {:else}
        <Icon icon="mingcute:close-fill" class="inline-block text-white text-lg" width="70" height="70"/>
        <h3 class="text-white text-2xl font-bold">Try again!</h3>
      {/if}
    </header>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Detected Words</h3>
      <p class="flex justify-center flex-wrap">
        <ReviewerWords words={card.words} colorIndices={originalWordsindicies} colorPriorities={colorPriorities} />
      </p>
    </div>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Detected Words</h3>
      <p class="flex justify-center flex-wrap">
        <ReviewerWords words={inputWordDetails} colorIndices={detectedColorIndices} colorPriorities={colorPriorities} />
      </p>
    </div>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Expected Words</h3>
      <p class="flex justify-center flex-wrap">
        <ReviewerWords words={referenceWordDetails} colorIndices={referenceColorIndices} colorPriorities={colorPriorities} />
      </p>
    </div>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Grade</h3>
      <p class="text-3xl flex justify-center">{grade}</p>
    </div>
  </div>
  <button
    class="btn-full btn-primary btn-md rounded-3xl "
    on:click={next}
    use:init
  >
    Next
  </button>
</div>