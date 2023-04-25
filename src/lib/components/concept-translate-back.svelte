<script>
  import ReviewSentence from '$lib/components/review-sentence.svelte';
  import ReviewWordEntry from '$lib/components/review-word-entry.svelte'
  import ReviewConceptCreator from '$lib/components/review-concept-creator.svelte'

  import { diffChars } from 'diff'
  import union from 'lodash/union'
	import { createEventDispatcher } from 'svelte';
  import { cleanSentence } from '$lib/features/story/utilities'
  import { getRemovedCharIndexes }  from '$lib/features/story-review/utilities'
	
  const dispatch = createEventDispatcher();

  export let card
  export let errorIndexes
  export let response

  let { front, back } = card

  let conceptWordIndexes = front.concept ? front.concept.sentenceIndexes : []
  let conceptTranslationIndexes = back.concept ? back.concept.sentenceIndexes : []

  let takenWords = []
  let takenTranslations = []
  let selectedWords = []
  let selectedTranslations = []
  let concepts = []
  let wordAdded = false
  let cantAdd = false

  $: selectedWordIndexes = selectedWords.map(word => word.index).sort((a, b) => a - b)
  $: selectedTranslationsIndexes = selectedTranslations.map(word => word.index).sort((a, b) => a - b)
  $: takenWordIndexes = union(takenWords.map(word => word.index), front.sentence.takenIndexes).sort((a, b) => a - b)
  $: takenTranslationIndexes = union(takenTranslations.map(word => word.index), back.sentence.takenIndexes).sort((a, b) => a - b)

  const toggleWord = (word) => {
    if (selectedWords.find(w => w.index === word.index)) {
      selectedWords = selectedWords.filter(w => w !== word)
    } else {
      selectedWords = [...selectedWords, word].sort((a, b) => a.index - b.index)
    }
  }
  
  const toggleTranslation = (translation) => {
    if (selectedTranslations.find(w => w.index === translation.index)) {
      selectedTranslations = selectedTranslations.filter(w => w !== translation)
    } else {
      selectedTranslations = [...selectedTranslations, translation].sort((a, b) => a.index - b.index)
    }
  }

  const resetSelection = (concepts) => {
    takenWords = [...takenWords, ...selectedWords]
    takenTranslations = [...takenTranslations, ...selectedTranslations]
    selectedWords = []
    selectedTranslations = []
  }

  const onCreateConcept = (concept) => {
    concepts = [...concepts, concept]
    resetSelection()
  }

  const onFinish = () => {
    dispatch('review', {
      card,
      response,
      newConcepts: concepts,
      deckId: card.deckId,
      conceptId: card.conceptId,
      errorIndexes,
    })
  }
</script>

<div class="flex flex-col h-full gap-5 px-[2px] rounded-3xl justify-between">
  <div class="flex flex-col h-full gap-5 overflow-auto">
    <ReviewSentence
      sentence={card.front.sentence}
      title="Prompt"
      enableReview={true}
      selectedIndexes={selectedWordIndexes}
      takenWordIndexes={takenWordIndexes}
      highlightedIndexes={conceptWordIndexes}
      on:clickWord={(e) => toggleWord(e.detail)}
    />
    <ReviewSentence
      sentence={card.back.sentence}
      errorIndexes={errorIndexes}
      original={response}
      title="Result"
      selectedIndexes={selectedTranslationsIndexes}
      takenWordIndexes={takenTranslationIndexes}
      highlightedIndexes={conceptTranslationIndexes}
      enableReview={true}
      on:clickWord={(e) => toggleTranslation(e.detail)}
    />
    <ReviewConceptCreator
      selectedWords={selectedWords}
      selectedTranslations={selectedTranslations}
      sentenceId={card.back.sentence.id}
      on:create={(e) => onCreateConcept(e.detail)}
    />
    
  </div>
  <button
    class="btn-full btn-secondary btn-md rounded-3xl "
    on:click={onFinish}
  >
    Next
  </button>
</div>
