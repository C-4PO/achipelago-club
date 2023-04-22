<script>
  import ReviewSentence from '$lib/components/review-sentence.svelte';
  import ReviewWordEntry from '$lib/components/review-word-entry.svelte'
  import uniq from 'lodash/uniq'

  import { diffChars } from 'diff'
	import { createEventDispatcher } from 'svelte';
  import { cleanSentence } from '$lib/features/story/utilities'
  import { getRemovedCharIndexes }  from '$lib/features/story-review/utilities'
	
  const dispatch = createEventDispatcher();

  export let card

  export let isFlipped = false

  let { front, back } = card

  let input = ''
  let errorIndexes = []
  let takenWords = []
  let takenTranslations = []
  let selectedWords = []
  let selectedTranslations = []
  let concepts = []
  let wordAdded = false
  let cantAdd = false

  $: selectedWordIndexes = selectedWords.map(word => word.index).sort((a, b) => a - b)
  $: selectedTranslationsIndexes = selectedTranslations.map(word => word.index).sort((a, b) => a - b)
  $: takenWordIndexes = takenWords.map(word => word.index).sort((a, b) => a - b)
  $: takenTranslationIndexes = takenTranslations.map(word => word.index).sort((a, b) => a - b)

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

  const replaceWords = (concepts) => {
    takenWords = concepts.map(concept => concept.words.sort((a, b) => a.index - b.index)).flat()
    takenTranslations = concepts.map(concept => concept.translationWords.sort((a, b) => a.index - b.index)).flat()
    selectedWords = []
    selectedTranslations = []
  }

  const onAddWord = () => {
    wordAdded = true
    setTimeout(() => {
      wordAdded = false
    }, 1000)
  }

  const onCantAdd = () => {
    cantAdd = true
    setTimeout(() => {
      cantAdd = false
    }, 1000)
  }

  const newConcept = (values) => {
    let words = selectedWords
    let tranlationWords = selectedTranslations
    if (values.sentence) {
      const cleanedInput = cleanSentence(values.sentence)
      words = cleanedInput.split(' ').map(word => {
        return {
          word,
        }
      })
    }
    if (values.sentence) {
      const cleanedInput = cleanSentence(values.translation)
      tranlationWords = cleanedInput.split(' ').map(word => {
        return {
          word,
        }
      })
    }

   return {
      words,
      translationWords: tranlationWords,
      type: values.type,
    }
  }

  const createConcept = (values) => {
    if (selectedWords.length === 0 && !values.sentence || selectedTranslations.length === 0  && !values.translation) {
      onCantAdd()
      return
    }
    const concept = newConcept(values)
    concepts = [...concepts, concept]
    replaceWords(concepts)
    onAddWord()
  }

  const onBack = () => {
    if (input.length > 0) {
      const cleanedInput = cleanSentence(input)
      let expected = card.back.words.map(word => word.word).join(' ')
      errorIndexes = getRemovedCharIndexes(expected, cleanedInput)
      isFlipped = true
    }
  }

  const onFinish = () => {
    dispatch('review', {
      input,
      errorIndexes,
      concepts, sentenceId:
      card.sentenceId,
      deckId: card.deckId
    })
  }
</script>

{#if !isFlipped}
  <ReviewSentence sentence={card.front} title="Prompt"/>
  <textarea
    class="text-area text-black p-4 h-full rounded-3xl bg-white resize-none"
    placeholder="Translate the prompt"
    bind:value={input}
  /> 
  <button
    class="btn btn-primary rounded-full"
    on:click={onBack}
  >
    Next
  </button>
{:else}
  <div class="flex flex-col h-full gap-5 overflow-auto rounded-3xl">
    <ReviewSentence
      sentence={card.front}
      title="Prompt"
      on:clickWord={(e) => toggleWord(e.detail)}
      enableReview={true}
      selectedIndexes={selectedWordIndexes}
      takenWordIndexes={takenWordIndexes}
    />
    <ReviewSentence
      sentence={card.back}
      errorIndexes={errorIndexes}
      original={input}
      title="Result"
      selectedIndexes={selectedTranslationsIndexes}
      takenWordIndexes={takenTranslationIndexes}
      on:clickWord={(e) => toggleTranslation(e.detail)} enableReview={true}
    />
    <ReviewWordEntry
      selectedWords={selectedWords}
      selectedTranslations={selectedTranslations}
      bind:wordAdded={wordAdded}
      bind:cantAdd={cantAdd}
      on:createConcept={(e) => createConcept(e.detail)}
    />
  </div>
  <button class="btn btn-primary rounded-full" on:click={onFinish}>Next</button>
{/if}