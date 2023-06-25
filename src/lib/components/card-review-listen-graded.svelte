<script>
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte';
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  export let shared

  const {
    review,
    grade,
    score,
    totalScore,
    inputWordDetails,
    referenceWordDetails,
    cardId,
    confidence,
  } = shared[`SPEAK`]

  console.log({
    inputWordDetails,
    referenceWordDetails
  })

  const backgroundColor = getBackgroundColor({ grade })
  const detectedColorIndices = inputWordDetails.map((detectedWord) => ({
    index: detectedWord.inputIndex,
    color: getWordColor(detectedWord),
  }))
  const referenceColorIndices = referenceWordDetails.map((detectedWord) => ({
    index: detectedWord.inputIndex,
    color: getWordColor(detectedWord),
  }))

  const colorPriorities = {
    '#F7B538': 1,
    '#780116': 2,
    '#00A676': 3,
  }

  function getWordColor({ inputIndex, referenceIndex, inLcs }) {
    if (inputIndex !== null && referenceIndex !== null && inLcs) {
      return '#00A676';
    } else if (inputIndex !== null && referenceIndex === null && !inLcs) {
      return '#780116';
    } else {
      return '#F7B538';
    }
  }

  function getBackgroundColor ({ grade }) {
    if (grade >= 4) {
      return '#00A676'
    } else if (grade >= 3) {
      return '#780116'
    } else {
      return '#F7B538'
    }
  }
</script>

<div class="flex flex-col h-full gap-5 px-[2px] rounded-3xl justify-between" style="background-color: {backgroundColor}">
  <div class="flex flex-col h-full gap-5 overflow-auto rounded-3xl p-5">
    <header class="flex justify-center items-center flex-col">
      {#if grade >= 4}
        <Icon icon="mingcute:check-fill" class="inline-block text-white text-lg" width="70" height="70" />
        <h3 class="text-white text-2xl font-bold">Great job!</h3>
      {:else if grade >= 2}
        <Icon icon="ph:smiley-meh-bold" class="inline-block text-white text-lg" width="70" height="70" />
        <h3 class="text-white text-2xl font-bold">Not bad!</h3>
      {:else}
        <Icon icon="mingcute:close-fill" class="inline-block text-white text-lg" width="70" height="70"/>
        <h3 class="text-white text-2xl font-bold">Try again!</h3>
      {/if}
    </header>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Detected Words</h3>
      <p class="flex justify-center">
        <ReviewerWords words={inputWordDetails} colorIndices={detectedColorIndices} colorPriorities={colorPriorities} />
      </p>
    </div>
    <div class="rounded-3xl bg-white p-3 text-black">
      <h3 class="text-xl font-bold text-center pb-1">Expected Words</h3>
      <p class="flex justify-center">
        <ReviewerWords words={referenceWordDetails} colorIndices={referenceColorIndices} colorPriorities={colorPriorities} />
      </p>
    </div>
  </div>
</div>