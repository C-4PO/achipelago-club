
<script>
  import { createEventDispatcher } from 'svelte';
  import ErrorBoundary from 'svelte-error-boundary';
  import ConceptTranslateFront from "$lib/components/concept-translate-front.svelte";
  import ConceptTranslateBack from "$lib/components/concept-translate-back.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import { getColorByPercentage } from '$lib/components/utilities'
  import { reviewTranslationCards } from "$lib/features/concept-review/utilities"
  
  import { getRemovedCharIndexes }  from '$lib/features/story-review/utilities'
  import { cleanSentence } from '$lib/features/story/utilities'
  
  export let card = {}
  export let isFlipped = false
  

  let errorIndexes = []
  let response = ''
  const dispatch = createEventDispatcher();
  let color;
  let rating;

  const onFlip = ({ translation }) => {
    const cleanedInput = cleanSentence(translation)
    let expected = card.back.sentence.words.map(word => word.word).join(' ')
    

    errorIndexes = getRemovedCharIndexes(expected, cleanedInput)
    let grade = reviewTranslationCards({ card, review: { errorIndexes }})
    if (grade >= 4) {
      color = '#00A676'
    } else if (grade >= 3) {
      color = '#F7B538'
    } else {
      color = '#780116'
    }

    rating = grade
    response = translation
    isFlipped = true
  }

  const onReview = (review) => {
    dispatch(`review`, review)
  }
</script>

<div class="flex flex-col w-full h-full overflow-hidden">
  <ReviewerCard isFlipped={isFlipped}>
    <div slot="front" class="h-full bg-secondary rounded-[50px] p-5">
      <ConceptTranslateFront front={card.front} on:flip={(e) => onFlip(e.detail)} />
    </div>
    <div slot="back" class="h-full rounded-[50px] p-5" style="background-color: {color}">
      <ConceptTranslateBack
        card={card}
        response={response}
        errorIndexes={errorIndexes}
        rating={rating}
        on:review={(e) => onReview(e.detail)}
      />
    <div/>
  </ReviewerCard>
</div>