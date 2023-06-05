<script>
  import ReviewerCard from "./reviewer-card.svelte";

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let slides = [];
  export let cardIndex = 0;
  export let enableReview = false;

  let carouselPosition = tweened(0, {
    duration: 500,
    easing: cubicOut,
  });

  $: {
    shiftSlide(cardIndex)
  }

  function shiftSlide(cardIndex) {
    carouselPosition.set(cardIndex * 100);
  }
</script>

<style>
  .slide {
    flex: 0 0 100%;
  }

  @media (min-width: 716px) {
    .slide {
      flex: 0 0 65%;
    }
    .slide:first-child {
		  margin-left: 17.5%;
	  }
  }
</style>


<div class="w-full relative flex aspect-[13/20] md:aspect-[1/1]">
  {#each slides as slide, index (slide.key)}
    <div 
      class="slide flex justify-center items-center font-size-24 relative aspect-[13/20] p-2"
      style="--i: {index}; transform: translateX(-{$carouselPosition}%);"
    >
      <slot index={index} slide={slide} show={index >= cardIndex ||  index <= cardIndex} />
    </div>
  {/each}
</div>
