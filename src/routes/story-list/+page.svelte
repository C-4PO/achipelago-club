<script>
  import { onMount } from 'svelte';
  import StoriesList from '$lib/components/stories-list.svelte';
  import StoriesGenerate from '$lib/components/stories-generate.svelte';
  import { writable, derived } from "svelte/store";
  import ConceptTranslate from "$lib/components/concept-translate.svelte";
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  import Reviewer from '$lib/components/reviewer.svelte';
  export let data;


  const stories = data.stories || [];

  const personalDeck = data.decks.find((deck) => deck.Decks.is_personal).Decks

  console.log({ personalDeck })

  const slides = writable([{ key: 1, id: 1, type: 'Stories' }, { key: 2, id: 2, type: 'Create' }])
  const index = writable(0)
  const currentSlide = derived([slides, index], ([$slides, $index]) => {
    return $slides[$index]
  })

  const goToCreate = () => index.set(1)
  const goToStories = () => index.set(0)

</script>

<Reviewer
  bind:cardIndex={$index}
  bind:slides={$slides}
  enableReview={false}
  let:slide={slide}
  let:index={index}
> 
  {#if slide.type === 'Stories'}
    <StoriesList personalDeck={personalDeck} isFlipped={$currentSlide.key === slide.key} stories={stories} cardBackground={cardBackground} on:navigate={(e) => goToCreate(e.detail)} />
  {/if}
  {#if slide.type === 'Create'}
    <StoriesGenerate isFlipped={$currentSlide.key === slide.key} cardBackground={cardBackground} on:navigate={(e) => goToStories(e.detail)}/>
  {/if}
</Reviewer>