<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let slides = [{}, {}, {}, {}, {}, {}];

  export let index = 0;

  let colors = [
    "rgba(255, 0, 0, 0.5)",
    "rgba(0, 255, 0, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(255, 255, 0, 0.5)",
    "rgba(255, 0, 255, 0.5)",
    "rgba(0, 255, 255, 0.5)",
  ];

  let carouselPosition = tweened(0, {
    duration: 500,
    easing: cubicOut,
  });

  $: {
    shiftSlide(index)
  }

  function shiftSlide(index) {
    carouselPosition.set(index * 100);
  }
</script>

<style>
	.slide:first-child {
		margin-left: 15%;
	}
</style>

<div class="w-full overflow-hidden relative flex aspect-[1]">
  {#each slides as slide, index (slide)}
    <div div class="slide flex justify-center items-center font-size-24 relative" style="flex: 0 0 70%; height: 100%; --i: {index}; background: {colors[index % colors.length]}; transform: translateX(-{$carouselPosition}%);">
      {JSON.stringify(slide, null, 1)}
    </div>
  {/each}
</div>
